const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRequired(value, fieldName) {
  if (!value?.trim()) {
    return `${fieldName} is required`;
  }

  return "";
}

export function validateEmail(email) {
  const requiredError = validateRequired(email, "Email");

  if (requiredError) {
    return requiredError;
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    return "Please enter a valid email address";
  }

  return "";
}

export function validatePassword(password) {
  const requiredError = validateRequired(password, "Password");

  if (requiredError) {
    return requiredError;
  }

  if (password.length < 8) {
    return "Password must contain at least 8 characters";
  }

  return "";
}

export function validateName(name, fieldName) {
  const requiredError = validateRequired(name, fieldName);

  if (requiredError) {
    return requiredError;
  }

  if (name.trim().length < 2) {
    return `${fieldName} must contain at least 2 characters`;
  }

  if (name.trim().length > 50) {
    return `${fieldName} cannot exceed 50 characters`;
  }

  return "";
}