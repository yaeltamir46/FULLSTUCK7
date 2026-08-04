import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../api/cartApi";
import { useAuth } from "../hooks/useAuth";

function createEmptyCart() {
  return {
    id: null,
    items: [],
    totalItems: 0,
    totalPrice: 0,
  };
}

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const {
    token,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();

  const [cart, setCart] = useState(createEmptyCart);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshCart = useCallback(async () => {
    if (!token) {
      setCart(createEmptyCart());
      return createEmptyCart();
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getCart(token);
      const receivedCart = response.data.cart;

      setCart(receivedCart);
      return receivedCart;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (isAuthenticated) {
      refreshCart().catch(() => {
        // The error is already stored in the context.
      });
    } else {
      setCart(createEmptyCart());
      setError(null);
    }
  }, [isAuthenticated, isAuthLoading, refreshCart]);

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      if (!token) {
        throw new Error("You must be logged in to add products");
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await addCartItem(
          productId,
          quantity,
          token
        );

        const updatedCart = response.data.cart;
        setCart(updatedCart);

        return updatedCart;
      } catch (requestError) {
        setError(requestError);
        throw requestError;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const updateItem = useCallback(
    async (productId, quantity) => {
      if (!token) {
        throw new Error("You must be logged in to update the cart");
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await updateCartItem(
          productId,
          quantity,
          token
        );

        const updatedCart = response.data.cart;
        setCart(updatedCart);

        return updatedCart;
      } catch (requestError) {
        setError(requestError);
        throw requestError;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const removeItem = useCallback(
    async (productId) => {
      if (!token) {
        throw new Error(
          "You must be logged in to remove products"
        );
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await removeCartItem(productId, token);
        const updatedCart = response.data.cart;

        setCart(updatedCart);
        return updatedCart;
      } catch (requestError) {
        setError(requestError);
        throw requestError;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const clear = useCallback(async () => {
    if (!token) {
      throw new Error("You must be logged in to clear the cart");
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await clearCart(token);
      const updatedCart = response.data.cart;

      setCart(updatedCart);
      return updatedCart;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      cart,
      isLoading,
      error,
      refreshCart,
      addItem,
      updateItem,
      removeItem,
      clear,
    }),
    [
      cart,
      isLoading,
      error,
      refreshCart,
      addItem,
      updateItem,
      removeItem,
      clear,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}