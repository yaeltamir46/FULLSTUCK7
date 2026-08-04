function Input({ id, label, error, ...inputProps }) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id}>{label}</label>

      <input
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />

      {error && (
        <span id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default Input;