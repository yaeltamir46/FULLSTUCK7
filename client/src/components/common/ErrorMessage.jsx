function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div role="alert">
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;