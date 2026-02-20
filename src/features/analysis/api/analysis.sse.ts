import type { AnalysisStatusEvent } from "../types";

export function subscribeToAnalysis(
  analysisId: string,
  onMessage: (event: AnalysisStatusEvent) => void,
  onError?: (error: Event) => void,
): () => void {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const url = `${API_BASE_URL}/api/logs/${analysisId}/stream`;

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
