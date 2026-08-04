import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";

function ProductCard({ product, onAddToCart }) {
  const [imageAvailable, setImageAvailable] = useState(
    Boolean(product.imageUrl)
  );

  const isOutOfStock = product.stockQuantity <= 0;

  function handleAddToCart() {
    if (!isOutOfStock && onAddToCart) {
      onAddToCart(product);
    }
  }

  return (
    <article>
      <Link to={`/products/${product.id}`}>
        {imageAvailable ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImageAvailable(false)}
          />
        ) : (
          <div aria-label="Product image unavailable">
            No image available
          </div>
        )}

        <h2>{product.name}</h2>
      </Link>

      {product.categoryName && (
        <p>{product.categoryName}</p>
      )}

      <p>{formatCurrency(product.price)}</p>

      <p>
        {isOutOfStock
          ? "Out of stock"
          : `${product.stockQuantity} available`}
      </p>

      {onAddToCart && (
        <Button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? "Out of stock" : "Add to cart"}
        </Button>
      )}
    </article>
  );
}

export default ProductCard;