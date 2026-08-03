import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../api/ordersApi";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import OrderCard from "../../components/orders/OrderCard";
import { useAuth } from "../../hooks/useAuth";

const INITIAL_FILTERS = {
  search: "",
  status: "",
};

function AdminOrdersPage() {
  const { token } = useAuth();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignoreResult = false;

    const requestTimer = setTimeout(async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getAllOrders(
          {
            ...filters,
            page,
            limit: 10,
          },
          token
        );

        if (!ignoreResult) {
          const receivedOrders =
            response.data.orders ?? response.data;

          setOrders(receivedOrders);
          setPagination(response.pagination);
        }
      } catch (requestError) {
        if (!ignoreResult) {
          setError(
            requestError.message || "Failed to load orders"
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
  }, [filters, page, token]);

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));

    setPage(1);
    setMessage("");
  }

  function handleResetFilters() {
    setFilters(INITIAL_FILTERS);
    setPage(1);
    setMessage("");
  }

  async function handleStatusChange(orderId, status) {
    setUpdatingId(orderId);
    setError("");
    setMessage("");

    try {
      const response = await updateOrderStatus(
        orderId,
        status,
        token
      );

      const updatedOrder = response.data.order;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === updatedOrder.id
            ? updatedOrder
            : order
        )
      );

      setMessage(
        `Order #${orderId} status updated successfully`
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section>
      <header>
        <h1>Orders</h1>
        <p>Review orders and update their status.</p>
      </header>

      <section aria-labelledby="order-filters-title">
        <h2 id="order-filters-title">Filter orders</h2>

        <Input
          id="admin-order-search"
          name="search"
          label="Search"
          type="search"
          placeholder="Order number, customer or email"
          value={filters.search}
          onChange={handleFilterChange}
        />

        <div>
          <label htmlFor="admin-order-status">
            Order status
          </label>

          <select
            id="admin-order-status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <Button type="button" onClick={handleResetFilters}>
          Reset filters
        </Button>
      </section>

      <ErrorMessage message={error} />

      {message && <p role="status">{message}</p>}

      {isLoading ? (
        <Loader message="Loading orders..." />
      ) : !orders.length ? (
        <EmptyState
          title="No orders found"
          message="No orders match the selected filters."
        />
      ) : (
        <div>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              statusEditable
              statusDisabled={updatingId === order.id}
              onStatusChange={(status) =>
                handleStatusChange(order.id, status)
              }
            />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <nav aria-label="Order management pages">
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

export default AdminOrdersPage;