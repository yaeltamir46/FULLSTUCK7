import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCategories } from "../../api/categoriesApi";
import { getProducts } from "../../api/productsApi";
import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";
import ProductFilters from "../../components/products/ProductFilters";
import ProductGrid from "../../components/products/ProductGrid";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

const INITIAL_FILTERS = {
  search: "",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
  inStock: "",
  sort: "newest",
};

function ProductsPage() {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    let ignoreResult = false;

    async function loadCategories() {
      try {
        const response = await getCategories();

        if (!ignoreResult) {
          setCategories(response.data.categories);
        }
      } catch (requestError) {
        if (!ignoreResult) {
          setError(
            requestError.message || "Failed to load categories"
          );
        }
      }
    }

    loadCategories();

    return () => {
      ignoreResult = true;
    };
  }, []);

  useEffect(() => {
    let ignoreResult = false;

    const requestTimer = setTimeout(async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getProducts({
          ...filters,
          page,
          limit: 12,
        });

        if (!ignoreResult) {
          setProducts(response.data);
          setPagination(response.pagination);
        }
      } catch (requestError) {
        if (!ignoreResult) {
          setError(
            requestError.message || "Failed to load products"
          );
          setProducts([]);
          setPagination(null);
        }
      } finally {
        if (!ignoreResult) {
          setIsLoading(false);
        }
      }
    }, 350);

    return () => {
      ignoreResult = true;
      clearTimeout(requestTimer);
    };
  }, [filters, page]);

  function handleFiltersChange(nextFilters) {
    setFilters(nextFilters);
    setPage(1);
    setCartMessage("");
    setCartError("");
  }

  function handleResetFilters() {
    setFilters(INITIAL_FILTERS);
    setPage(1);
    setCartMessage("");
    setCartError("");
  }

  async function handleAddToCart(product) {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: {
            pathname: location.pathname,
          },
        },
      });

      return;
    }

    setCartMessage("");
    setCartError("");

    try {
      await addItem(product.id, 1);
      setCartMessage(`${product.name} was added to your cart`);
    } catch (requestError) {
      setCartError(
        requestError.message || "Failed to add product to cart"
      );
    }
  }

  return (
    <section>
      <header>
        <h1>Shop craft supplies</h1>
        <p>
          Find materials and tools for your next creation.
        </p>
      </header>

      <ProductFilters
        filters={filters}
        categories={categories}
        onChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {cartMessage && (
        <p role="status">{cartMessage}</p>
      )}

      <ErrorMessage message={cartError} />

      <ProductGrid
        products={products}
        isLoading={isLoading}
        error={error}
        onAddToCart={handleAddToCart}
      />

      {pagination && pagination.totalPages > 1 && (
        <nav aria-label="Product pages">
          <Button
            type="button"
            disabled={page <= 1 || isLoading}
            onClick={() =>
              setPage((currentPage) => currentPage - 1)
            }
          >
            Previous
          </Button>

          <span>
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </span>

          <Button
            type="button"
            disabled={
              page >= pagination.totalPages || isLoading
            }
            onClick={() =>
              setPage((currentPage) => currentPage + 1)
            }
          >
            Next
          </Button>
        </nav>
      )}
    </section>
  );
}

export default ProductsPage;