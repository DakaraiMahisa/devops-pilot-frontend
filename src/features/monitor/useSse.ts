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

export const useSse = () => {
  const [pipelines, setPipelines] = useState<PipelineExecution[]>([]);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const eventSource = new EventSource(`${baseUrl}/api/sse/stream`);

    const updateState = (event: MessageEvent) => {
      try {
        const data: PipelineExecution = JSON.parse(event.data);
        setPipelines((prev) => {
          const index = prev.findIndex((p) => p.id === data.id);
          if (index !== -1) {
            if (JSON.stringify(prev[index]) === JSON.stringify(data))
              return prev;

            const newPipelines = [...prev];
            newPipelines[index] = data;
            return newPipelines;
          }
          return [data, ...prev];
        });
      } catch (err) {
        console.error("Failed to parse SSE data", err);
      }
    };

    eventSource.addEventListener("pipeline-init", updateState);
    eventSource.addEventListener("pipeline-pulse", updateState);
    eventSource.addEventListener("pipeline-complete", updateState);

    eventSource.onerror = (err) => {
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log("SSE connection was closed.", err);
      } else if (eventSource.readyState === EventSource.CONNECTING) {
        console.log("SSE attempting to reconnect...");
      }
    };

    return () => {
      eventSource.removeEventListener("pipeline-init", updateState);
      eventSource.removeEventListener("pipeline-pulse", updateState);
      eventSource.removeEventListener("pipeline-complete", updateState);
      eventSource.close();
    };
  }, []);

  return pipelines;
};
