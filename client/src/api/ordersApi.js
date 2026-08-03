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

export function createOrder(shippingAddress, token) {
  return apiRequest("/orders", {
    method: "POST",
    body: {
      shippingAddress,
    },
    token,
  });
}

export function getMyOrders(token) {
  return apiRequest("/orders/my", {
    token,
  });
}

export function getOrderById(orderId, token) {
  return apiRequest(`/orders/${orderId}`, {
    token,
  });
}

export function getAllOrders(filters = {}, token) {
  const queryString = buildQueryString(filters);

  return apiRequest(`/orders${queryString}`, {
    token,
  });
}

export function updateOrderStatus(orderId, status, token) {
  return apiRequest(`/orders/${orderId}/status`, {
    method: "PATCH",
    body: {
      status,
    },
    token,
  });
}