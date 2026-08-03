import { apiRequest } from "./apiClient";

export function getCart(token) {
  return apiRequest("/cart", {
    token,
  });
}

export function addCartItem(productId, quantity, token) {
  return apiRequest("/cart/items", {
    method: "POST",
    body: {
      productId,
      quantity,
    },
    token,
  });
}

export function updateCartItem(productId, quantity, token) {
  return apiRequest(`/cart/items/${productId}`, {
    method: "PATCH",
    body: {
      quantity,
    },
    token,
  });
}

export function removeCartItem(productId, token) {
  return apiRequest(`/cart/items/${productId}`, {
    method: "DELETE",
    token,
  });
}

export function clearCart(token) {
  return apiRequest("/cart", {
    method: "DELETE",
    token,
  });
}