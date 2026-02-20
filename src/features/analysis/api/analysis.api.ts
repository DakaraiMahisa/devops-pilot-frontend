import { httpPost, httpGet } from "../../../shared/http/httpClient";
import type { CreateAnalysisRequest, LogAnalysisRecord } from "../types";

interface CreateAnalysisResponse {
  analysisId: string;
  status: string;
}

export async function createAnalysis(
  pipelineType: string,
  logText: string,
): Promise<string> {
  const body: CreateAnalysisRequest = {
    pipelineType,
    logText,
  };

  const response = await httpPost<CreateAnalysisResponse>(
    "/api/logs/analyze",
    body,
  );
  return response.analysisId;
}

export async function getAnalysis(
  analysisId: string,
): Promise<LogAnalysisRecord> {
  console.log("Fetching data for ID:", analysisId);

  return httpGet<LogAnalysisRecord>(`/api/analyses/${analysisId}`);
}
