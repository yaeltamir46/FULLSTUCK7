import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getMyOrders } from "../../api/ordersApi";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import OrderCard from "../../components/orders/OrderCard";
import { useAuth } from "../../hooks/useAuth";

function MyOrdersPage() {
  const { token } = useAuth();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignoreResult = false;

    async function loadOrders() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getMyOrders(token);

        if (!ignoreResult) {
          setOrders(response.data.orders);
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
    }

    loadOrders();

    return () => {
      ignoreResult = true;
    };
  }, [token]);

  if (isLoading) {
    return <Loader message="Loading your orders..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <section>
      <h1>My orders</h1>

      {location.state?.message && (
        <p role="status">{location.state.message}</p>
      )}

      {!orders.length ? (
        <EmptyState
          title="You have no orders yet"
          message="Your completed orders will appear here."
          action={<Link to="/products">Browse products</Link>}
        />
      ) : (
        <div>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}

export default MyOrdersPage;