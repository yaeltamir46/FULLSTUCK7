import { apiRequest } from "./apiClient";

function buildQueryString(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    const hasValue =
      value !== undefined &&
      value !== null &&
      value !== "";

    if (hasValue) {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
}

export function updateMyProfile(profileData, token) {
  return apiRequest("/users/me", {
    method: "PATCH",
    body: profileData,
    token,
  });
}

export function getAllUsers(filters = {}, token) {
  const queryString = buildQueryString(filters);

  return apiRequest(`/users${queryString}`, {
    token,
  });
}

export function updateUserStatus(userId, isActive, token) {
  return apiRequest(`/users/${userId}/status`, {
    method: "PATCH",
    body: {
      isActive,
    },
    token,
  });
}