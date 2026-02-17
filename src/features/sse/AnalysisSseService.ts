import type { AnalysisStatusChangedEvent } from "@/shared/types";

export function subscribeToAnalysis(
  analysisId: string,
  onEvent: (event: AnalysisStatusChangedEvent) => void,
) {
  const eventSource = new EventSource(
    `http://localhost:8080/api/analyses/stream/${analysisId}`,
  );

  eventSource.addEventListener("analysis-status", (event) => {
    const parsed = JSON.parse((event as MessageEvent).data);
    onEvent(parsed);
  });

  eventSource.onerror = (error) => {
    console.error("SSE error:", error);
  };

  return () => eventSource.close();
}
