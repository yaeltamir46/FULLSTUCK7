import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  deleteProduct,
  getProducts,
} from "../../api/productsApi";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/formatCurrency";

function AdminProductsPage() {
  const { token } = useAuth();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(
    location.state?.message || ""
  );

  useEffect(() => {
    let ignoreResult = false;

    const requestTimer = setTimeout(async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getProducts({
          search,
          page,
          limit: 10,
          includeInactive: true,
        },
        token
      );

        if (!ignoreResult) {
          setProducts(response.data);
          setPagination(response.pagination);
        }
      } catch (requestError) {
        if (!ignoreResult) {
          setError(
            requestError.message || "Failed to load products"
          );
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
  }, [search, page, token]);

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
    setMessage("");
  }

  async function handleDeactivate(product) {
    const confirmed = window.confirm(
      `Deactivate "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(product.id);
    setError("");
    setMessage("");

    try {
      await deleteProduct(product.id, token);

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === product.id
            ? { ...currentProduct, isActive: false }
            : currentProduct
        )
      );

      setMessage("Product deactivated successfully");
    } catch (requestError) {
      setError(
        requestError.message || "Failed to deactivate product"
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <header>
        <div>
          <h1>Products</h1>
          <p>Manage products, inventory and availability.</p>
        </div>

        <Link to="/admin/products/new">
          Add product
        </Link>
      </header>

      <Input
        id="admin-product-search"
        name="search"
        label="Search products"
        type="search"
        placeholder="Search by product name"
        value={search}
        onChange={handleSearchChange}
      />

      <ErrorMessage message={error} />

      {message && <p role="status">{message}</p>}

      {isLoading ? (
        <Loader message="Loading products..." />
      ) : !products.length ? (
        <EmptyState
          title="No products found"
          message="Try a different search or add a product."
        />
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">Stock</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.categoryName}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.stockQuantity}</td>
                <td>
                  {product.isActive ? "Active" : "Inactive"}
                </td>
                <td>
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                  >
                    Edit
                  </Link>

                  {product.isActive && (
                    <Button
                      type="button"
                      isLoading={deletingId === product.id}
                      disabled={Boolean(deletingId)}
                      onClick={() =>
                        handleDeactivate(product)
                      }
                    >
                      Deactivate
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pagination && pagination.totalPages > 1 && (
        <nav aria-label="Product management pages">
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

export default AdminProductsPage;