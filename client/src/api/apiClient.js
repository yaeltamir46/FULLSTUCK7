const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(
  endpoint,
  { method = "GET", body, token, isFormData = false } = {}
) {
  if (!API_URL) {
    throw new Error("VITE_API_URL is not defined");
  }

  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  const responseText = await response.text();
  const responseBody = responseText ? JSON.parse(responseText) : {};

  if (!response.ok) {
    const apiError = new Error(
      responseBody.error?.message || "An unexpected error occurred"
    );

    apiError.status = response.status;
    apiError.code = responseBody.error?.code || "UNKNOWN_ERROR";
    apiError.details = responseBody.error?.details || null;

    throw apiError;
  }

  return responseBody;
}