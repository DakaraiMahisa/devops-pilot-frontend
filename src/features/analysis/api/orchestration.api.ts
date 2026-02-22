import axios from "axios";
import { type OrchestrationTask } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL + "/api/orchestration";

export const getActiveTasks = async (): Promise<OrchestrationTask[]> => {
  const response = await axios.get(`${API_BASE}/active`);
  return response.data;
};

export const promoteToOps = async (analysisId: string) => {
  const response = await axios.post(`${API_BASE}/promote/${analysisId}`);
  return response.data;
};

export const triggerFix = async (taskId: string) => {
  const response = await axios.post(`${API_BASE}/${taskId}/execute`);
  return response.data;
};
