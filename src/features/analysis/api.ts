import { post } from "@/shared/api/httpClient";
import type { StartAnalysisResponse } from "@/shared/types";

export function startAnalysis(
  logText: string,
  pipelineType: string,
): Promise<StartAnalysisResponse> {
  return post("/api/logs/analyze", { logText, pipelineType });
}
