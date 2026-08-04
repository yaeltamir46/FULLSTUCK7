import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../../api/productsApi";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";

function ProductDetailsPage() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignoreResult = false;

    async function loadProduct() {
      setIsLoading(true);
      setError("");
      setImageError(false);

      try {
        const response = await getProductById(productId);

        if (!ignoreResult) {
          setProduct(response.data.product);
        }
      } catch (requestError) {
        if (!ignoreResult) {
          setError(
            requestError.message || "Failed to load product"
          );
          setProduct(null);
        }
      } finally {
        if (!ignoreResult) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      ignoreResult = true;
    };
  }, [productId]);

  if (isLoading) {
    return <Loader message="Loading product..." />;
  }

  if (error) {
    return (
      <section>
        <ErrorMessage message={error} />
        <Link to="/products">Back to products</Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section>
        <h1>Product not found</h1>
        <Link to="/products">Back to products</Link>
      </section>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <article>
      <Link to="/products">← Back to products</Link>

      <div>
        {product.imageUrl && !imageError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div aria-label="Product image unavailable">
            No image available
          </div>
        )}
      </div>

      <div>
        {product.categoryName && (
          <p>{product.categoryName}</p>
        )}

        <h1>{product.name}</h1>

        <p>{formatCurrency(product.price)}</p>

        <p>{product.description}</p>

        <p>
          {isOutOfStock
            ? "Out of stock"
            : `${product.stockQuantity} items available`}
        </p>
      </div>
    </article>
  );
}

export default ProductDetailsPage;