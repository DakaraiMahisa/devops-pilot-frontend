import type { AnalysisStatusEvent } from "../types";

export function subscribeToAnalysis(
  analysisId: string,
  onMessage: (event: AnalysisStatusEvent) => void,
  onError?: (error: Event) => void,
): () => void {
  const url = `/api/logs/${analysisId}/stream`;

  const eventSource = new EventSource(url);

  eventSource.addEventListener("analysis-status", (event: MessageEvent) => {
    try {
      const data: AnalysisStatusEvent = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error("Failed to parse SSE message", err);
    }
  });

  eventSource.onerror = (error) => {
    if (onError) {
      onError(error);
    }
  };

  return () => {
    eventSource.close();
  };
}
