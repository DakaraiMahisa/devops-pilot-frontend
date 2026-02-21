import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api/analytics";

// Added 'days' parameter to each call to support the Time Range filter
export const getCategoryStats = (days: string) =>
  axios
    .get(`${BASE_URL}/errors/category`, { params: { days } })
    .then((res) => res.data);

export const getPipelineStats = (days: string) =>
  axios
    .get(`${BASE_URL}/pipelines`, { params: { days } })
    .then((res) => res.data);

// Note: Ensure the URL matches your backend route (trend vs trends)
export const getTrendStats = (days: string) =>
  axios
    .get(`${BASE_URL}/trend/daily`, { params: { days } })
    .then((res) => res.data);

export const getConfidenceStats = (days: string) =>
  axios
    .get(`${BASE_URL}/confidence/category`, { params: { days } })
    .then((res) => res.data);
