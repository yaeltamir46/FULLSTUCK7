import { Link } from "react-router-dom";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";

function CartSummary({ cart, onClear, isLoading }) {
  return (
    <aside>
      <h2>Order summary</h2>

      <p>Total items: {cart.totalItems}</p>
      <p>Total: {formatCurrency(cart.totalPrice)}</p>

      <Link to="/checkout">Proceed to checkout</Link>

      <Button
        type="button"
        disabled={isLoading}
        onClick={onClear}
      >
        Clear cart
      </Button>
    </aside>
  );
}

export default CartSummary;