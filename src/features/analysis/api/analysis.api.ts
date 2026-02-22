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

export async function getAnalysisHistory(): Promise<LogAnalysisRecord[]> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/analyses`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }

  const data = await response.json();

  return data.content || [];
}

export async function getAnalysisById(id: string): Promise<LogAnalysisRecord> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/analyses/${id}`,
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Analysis report not found.");
    }
    throw new Error("Failed to load the historical report.");
  }

  return response.json();
}

export async function searchHistory(filters: {
  errorCategory?: string;
  pipelineType?: string;
  page?: number;
  size?: number;
}) {
  const params = new URLSearchParams();
  if (filters.errorCategory)
    params.append("errorCategory", filters.errorCategory);
  if (filters.pipelineType) params.append("pipelineType", filters.pipelineType);
  params.append("page", (filters.page || 0).toString());
  params.append("size", (filters.size || 10).toString());

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/analyses/search?${params.toString()}`,
  );

  if (!response.ok) throw new Error("Failed to search history");
  return response.json();
}

export async function deleteAnalyses(ids: string[]): Promise<void> {
  const params = new URLSearchParams();
  ids.forEach((id) => params.append("ids", id));

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/analyses?${params.toString()}`,
    { method: "DELETE" },
  );

  if (!response.ok) throw new Error("Failed to delete records");
}
export const fetchAnalysisById = async (analysisId: string) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/analyses/${analysisId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch analysis details");
  }

  return response.json();
};
