import EmptyState from "../common/EmptyState";
import ErrorMessage from "../common/ErrorMessage";
import Loader from "../common/Loader";
import ProductCard from "./ProductCard";

function ProductGrid({
  products,
  isLoading,
  error,
  onAddToCart,
}) {
  if (isLoading) {
    return <Loader message="Loading products..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={
          typeof error === "string"
            ? error
            : error.message
        }
      />
    );
  }

  if (!products?.length) {
    return (
      <EmptyState
        title="No products found"
        message="Try changing your search or filters."
      />
    );
  }

  return (
    <div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default ProductGrid;