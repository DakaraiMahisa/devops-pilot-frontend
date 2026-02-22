import { useEffect, useState } from "react";

export interface PipelineExecution {
  id: string;
  pipelineName: string;
  commitId: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  cpuUsage: number;
  memUsage: number;
  startTime: string;
  endTime?: string;
  analysisId?: string;
  analysis?: {
    summary: string;
    rootCause: string;
    suggestedFixes: string[];
  };
}

interface UseSseOptions {
  includeHistory?: boolean;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export const useSse = (options: UseSseOptions = { includeHistory: true }) => {
  const [pipelines, setPipelines] = useState<PipelineExecution[]>([]);
  const [loading, setLoading] = useState(!!options.includeHistory);
  const [totalPages, setTotalPages] = useState(0);

  const { includeHistory, page, limit, startDate, endDate } = options;

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    if (includeHistory) {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          const params = new URLSearchParams({
            page: String(page ?? 0),
            size: String(limit ?? 10),
            // Ensure we only send params if they have values to avoid 400/500 errors
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          });

          const response = await fetch(
            `${baseUrl}/api/pipelines/history?${params}`,
          );

          // Guard against non-200 responses (like the 500 error you saw)
          if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
          }

          const data = await response.json();

          if (data && data.content) {
            setPipelines(data.content);
            setTotalPages(data.totalPages);
          } else if (Array.isArray(data)) {
            setPipelines(data);
            setTotalPages(1);
          } else {
            // Fallback if data is not in expected format
            setPipelines([]);
          }
        } catch (err) {
          console.error("Failed to load history:", err);
          // CRITICAL: Reset to empty array so History.tsx:32 doesn't crash on .filter()
          setPipelines([]);
          setTotalPages(0);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    } else {
      setLoading(false);
    }

    const eventSource = new EventSource(`${baseUrl}/api/sse/stream`);

    const updateState = (event: MessageEvent) => {
      try {
        const data: PipelineExecution = JSON.parse(event.data);
        setPipelines((prev) => {
          // Extra safety check for prev array
          const currentList = Array.isArray(prev) ? prev : [];

          const index = currentList.findIndex((p) => p.id === data.id);
          if (index !== -1) {
            if (JSON.stringify(currentList[index]) === JSON.stringify(data))
              return currentList;
            const newPipelines = [...currentList];
            newPipelines[index] = data;
            return newPipelines;
          }
          return page === 0 || !includeHistory
            ? [data, ...currentList]
            : currentList;
        });
      } catch (err) {
        console.error("Failed to parse SSE data", err);
      }
    };

    eventSource.addEventListener("pipeline-init", updateState);
    eventSource.addEventListener("pipeline-pulse", updateState);
    eventSource.addEventListener("pipeline-complete", updateState);

    return () => {
      eventSource.removeEventListener("pipeline-init", updateState);
      eventSource.removeEventListener("pipeline-pulse", updateState);
      eventSource.removeEventListener("pipeline-complete", updateState);
      eventSource.close();
    };
  }, [includeHistory, page, limit, startDate, endDate]);

  return { pipelines, loading, totalPages };
};
