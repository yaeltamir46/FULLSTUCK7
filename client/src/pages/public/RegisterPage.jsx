import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";
import Input from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../utils/validators";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      firstName: validateName(formData.firstName, "First name"),
      lastName: validateName(formData.lastName, "Last name"),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword:
        formData.password === formData.confirmPassword
          ? ""
          : "Passwords do not match",
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
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      navigate("/", { replace: true });
    } catch (error) {
      if (error.details) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          ...error.details,
        }));
      }

      setServerError(error.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Create an account</h1>
      <p>Join Craftify and start creating.</p>

      <ErrorMessage message={serverError} />

      <form onSubmit={handleSubmit} noValidate>
        <Input
          id="firstName"
          label="First name"
          type="text"
          autoComplete="given-name"
          value={formData.firstName}
          error={errors.firstName}
          onChange={handleChange}
        />

        <Input
          id="lastName"
          label="Last name"
          type="text"
          autoComplete="family-name"
          value={formData.lastName}
          error={errors.lastName}
          onChange={handleChange}
        />

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
          autoComplete="new-password"
          value={formData.password}
          error={errors.password}
          onChange={handleChange}
        />

        <Input
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          error={errors.confirmPassword}
          onChange={handleChange}
        />

        <Button type="submit" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">Log in</Link>
      </p>
    </section>
  );
}

export default RegisterPage;