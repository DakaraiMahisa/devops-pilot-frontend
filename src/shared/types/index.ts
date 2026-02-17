export interface LogAnalysisRecordResponse {
  id: string;
  summary: string;
  rootCause: string;
  errorCategory: string;
  confidence: number;
  pipelineType: string;
  createdAt: string;
  status: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
export interface StartAnalysisResponse {
  analysisId: string;
}

export interface AnalysisStatusChangedEvent {
  analysisId: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  message?: string | null;
  summary?: string | null;
}
