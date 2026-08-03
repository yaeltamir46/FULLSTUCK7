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

export function getProducts(filters = {}, token) {
  const queryString = buildQueryString(filters);

  return apiRequest(`/products${queryString}`, {
    token,
  });
}

export function getProductById(productId) {
  return apiRequest(`/products/${productId}`);
}

export function createProduct(formData, token) {
  return apiRequest("/products", {
    method: "POST",
    body: formData,
    token,
    isFormData: true,
  });
}

export function updateProduct(productId, formData, token) {
  return apiRequest(`/products/${productId}`, {
    method: "PUT",
    body: formData,
    token,
    isFormData: true,
  });
}

export function deleteProduct(productId, token) {
  return apiRequest(`/products/${productId}`, {
    method: "DELETE",
    token,
  });
}