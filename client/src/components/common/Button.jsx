function Button({
  children,
  isLoading = false,
  type = "button",
  disabled,
  ...buttonProps
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      {...buttonProps}
    >
      {isLoading ? "Please wait..." : children}
    </button>
  );
}

export default Button;