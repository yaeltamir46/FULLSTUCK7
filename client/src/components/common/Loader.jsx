function Loader({ message = "loading..." }) {
  return (
    <div role="status" aria-live="polite">
      <p>{message}</p>
    </div>
  );
}

export default Loader;