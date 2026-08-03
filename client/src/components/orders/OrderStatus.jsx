import { useId } from "react";

const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

function formatStatus(status) {
  if (!status) {
    return "";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function OrderStatus({
  status,
  editable = false,
  onChange,
  disabled = false,
}) {
  const selectId = useId();

  if (!editable) {
    return <span>Status: {formatStatus(status)}</span>;
  }

  return (
    <div>
      <label htmlFor={selectId}>Status</label>

      <select
        id={selectId}
        value={status}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        {ORDER_STATUSES.map((orderStatus) => (
          <option key={orderStatus} value={orderStatus}>
            {formatStatus(orderStatus)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default OrderStatus;