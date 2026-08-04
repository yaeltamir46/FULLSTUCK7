import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";
import Input from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";
import {
  validateEmail,
  validateRequired,
} from "../../utils/validators";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setServerError("");
  }

  function validateForm() {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validateRequired(formData.password, "Password"),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      const user = await login(
        formData.email.trim(),
        formData.password
      );

      const requestedPath = location.state?.from?.pathname;
      const destination =
        requestedPath || (user.role === "admin" ? "/admin" : "/");

      navigate(destination, { replace: true });
    } catch (error) {
      if (error.details) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          ...error.details,
        }));
      }

      setServerError(error.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Log in</h1>
      <p>Welcome back to Craftify.</p>

      <ErrorMessage message={serverError} />

      <form onSubmit={handleSubmit} noValidate>
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={formData.email}
          error={errors.email}
          onChange={handleChange}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={formData.password}
          error={errors.password}
          onChange={handleChange}
        />

        <Button type="submit" isLoading={isSubmitting}>
          Log in
        </Button>
      </form>

      <p>
        Do not have an account?{" "}
        <Link to="/register">Create an account</Link>
      </p>
    </section>
  );
}

export default LoginPage;