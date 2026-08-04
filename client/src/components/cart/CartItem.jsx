import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";

function CartItem({
  item,
  onQuantityChange,
  onRemove,
  isLoading,
}) {
  async function handleQuantityChange(event) {
    const quantity = Number(event.target.value);

    if (quantity >= 1 && quantity <= item.stockQuantity) {
      await onQuantityChange(item.productId, quantity);
    }
  }

  return (
    <article>
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.name} />
      ) : (
        <div>No image available</div>
      )}

      <div>
        <h2>{item.name}</h2>
        <p>{formatCurrency(item.price)} each</p>

        <label htmlFor={`quantity-${item.productId}`}>
          Quantity
        </label>

        <input
          id={`quantity-${item.productId}`}
          type="number"
          min="1"
          max={item.stockQuantity}
          value={item.quantity}
          disabled={isLoading}
          onChange={handleQuantityChange}
        />

        <p>
          Item total: {formatCurrency(item.lineTotal)}
        </p>

        <Button
          type="button"
          disabled={isLoading}
          onClick={() => onRemove(item.productId)}
        >
          Remove
        </Button>
      </div>
    </article>
  );
}

export default CartItem;