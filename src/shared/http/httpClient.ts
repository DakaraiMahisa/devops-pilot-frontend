const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Utility to get the current Pilot's access token
 */
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function httpPost<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorText = errorData?.message || (await response.text());
    throw new Error(errorText || "Request failed");
  }

  return response.json();
}

export async function httpGet<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorText = errorData?.message || (await response.text());
    throw new Error(errorText || "Request failed");
  }

  return response.json();
}
