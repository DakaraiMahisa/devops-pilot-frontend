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
  return httpGet<LogAnalysisRecord>(`/api/logs/${analysisId}`);
}
export async function submitAnalysis(
  logText: string,
  pipelineType: string,
): Promise<string> {
  const response = await fetch("http://localhost:8080/api/logs/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ logText, pipelineType }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit analysis");
  }

  const data = await response.json();
  return data.analysisId;
}
