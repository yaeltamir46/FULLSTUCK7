import { apiRequest } from "./apiClient";

export function getCategories(
  { includeInactive = false } = {},
  token
) {
  const queryString = includeInactive
    ? "?includeInactive=true"
    : "";

  return apiRequest(`/categories${queryString}`, {
    token,
  });
}

export function createCategory(categoryData, token) {
  return apiRequest("/categories", {
    method: "POST",
    body: categoryData,
    token,
  });
}

export function updateCategory(categoryId, categoryData, token) {
  return apiRequest(`/categories/${categoryId}`, {
    method: "PUT",
    body: categoryData,
    token,
  });
}

export function deleteCategory(categoryId, token) {
  return apiRequest(`/categories/${categoryId}`, {
    method: "DELETE",
    token,
  });
}