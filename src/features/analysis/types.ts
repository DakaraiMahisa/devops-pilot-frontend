/* ============================
   Shared Enums
============================ */

export type AnalysisStatus = "PROCESSING" | "COMPLETED" | "FAILED";

export type ErrorCategory =
  | "BUILD_CONFIGURATION"
  | "DEPENDENCY_RESOLUTION"
  | "ENVIRONMENT_MISMATCH"
  | "INFRASTRUCTURE"
  | "PERMISSION_AUTH"
  | "TIMEOUT_RESOURCE"
  | "DATABASE"
  | "UNKNOWN"
  | "CONFIGURATION_ERROR";

/* ============================
   POST /api/logs
============================ */

export interface CreateAnalysisRequest {
  pipelineType: string;
  logText: string;
}

export interface CreateAnalysisResponse {
  id: string;
  status: AnalysisStatus; // should be "PENDING"
}

/* ============================
   GET /api/logs/{id}
============================ */

export interface LogAnalysisRecord {
  id: string;
  pipelineType: string;
  logText: string;

  summary?: string | null;
  rootCause?: string | null;

  errorCategory?: ErrorCategory | null;
  confidence?: number | null;

  status: AnalysisStatus;
  failureReason?: string | null;

  suggestedFixes?: string[] | null;

  createdAt: string; // ISO string
}

/* ============================
   SSE: analysis-status event
============================ */

export interface AnalysisStatusEvent {
  analysisId: string;
  status: AnalysisStatus;
  message: string;
  summary?: string | null;
}
export interface CategoryStat {
  category: string;
  count: number;
}

export interface PipelineStat {
  pipelineType: string;
  count: number;
}
export interface DailyTrendStat {
  date: string;
  count: number;
}

export interface ConfidenceStat {
  category: string;
  averageConfidence: number;
}
