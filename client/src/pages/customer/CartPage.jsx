import { Link } from "react-router-dom";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import { useCart } from "../../hooks/useCart";

function CartPage() {
  const {
    cart,
    isLoading,
    error,
    updateItem,
    removeItem,
    clear,
  } = useCart();

  async function handleQuantityChange(productId, quantity) {
    try {
      await updateItem(productId, quantity);
    } catch {
      // The context already stores and displays the error.
    }
  }

  async function handleRemove(productId) {
    try {
      await removeItem(productId);
    } catch {
      // The context already stores and displays the error.
    }
  }

  async function handleClear() {
    try {
      await clear();
    } catch {
      // The context already stores and displays the error.
    }
  }

  if (isLoading && !cart.items.length) {
    return <Loader message="Loading your cart..." />;
  }

  if (!cart.items.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Browse our products and find something to create."
        action={<Link to="/products">Browse products</Link>}
      />
    );
  }

  return (
    <section>
      <h1>Your cart</h1>

      <ErrorMessage message={error?.message} />

      <div>
        <div>
          {cart.items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              isLoading={isLoading}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          ))}
        </div>

        <CartSummary
          cart={cart}
          isLoading={isLoading}
          onClear={handleClear}
        />
      </div>
    </section>
  );
}

export default CartPage;