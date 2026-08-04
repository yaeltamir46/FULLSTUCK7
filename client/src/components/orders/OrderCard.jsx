import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import OrderStatus from "./OrderStatus";

function OrderCard({
  order,
  statusEditable = false,
  onStatusChange,
  statusDisabled = false,
}) {
  return (
    <article>
      <header>
        <div>
          <h2>Order #{order.id}</h2>
          <p>Placed on {formatDate(order.createdAt)}</p>
        </div>

        <OrderStatus
          status={order.status}
          editable={statusEditable}
          disabled={statusDisabled}
          onChange={onStatusChange}
        />
      </header>

      {order.customerName && (
        <p>Customer: {order.customerName}</p>
      )}

      <ul>
        {order.items?.map((item) => (
          <li key={item.id}>
            <span>{item.productName}</span>

            <span>
              {item.quantity} ×{" "}
              {formatCurrency(item.unitPrice)}
            </span>

            <span>{formatCurrency(item.lineTotal)}</span>
          </li>
        ))}
      </ul>

      <footer>
        <strong>
          Total: {formatCurrency(order.totalPrice)}
        </strong>
      </footer>
    </article>
  );
}

export default OrderCard;