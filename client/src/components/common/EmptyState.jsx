function EmptyState({
  title = "Nothing to display",
  message,
  action,
}) {
  return (
    <div>
      <h2>{title}</h2>

      {message && <p>{message}</p>}

      {action}
    </div>
  );
}

export default EmptyState;