import { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import { updateMyProfile } from "../../api/usersApi";
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../utils/formatDate";
import { validateName } from "../../utils/validators";

function ProfilePage() {
  const {
    user,
    token,
    isLoading: isAuthLoading,
    refreshUser,
  } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  }, [user]);

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
    setSuccessMessage("");
  }

  function validateForm() {
    const newErrors = {
      firstName: validateName(
        formData.firstName,
        "First name"
      ),
      lastName: validateName(
        formData.lastName,
        "Last name"
      ),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const trimmedFirstName = formData.firstName.trim();
    const trimmedLastName = formData.lastName.trim();

    const changedFields = {};

    if (trimmedFirstName !== user.firstName) {
      changedFields.firstName = trimmedFirstName;
    }

    if (trimmedLastName !== user.lastName) {
      changedFields.lastName = trimmedLastName;
    }

    if (!Object.keys(changedFields).length) {
      setSuccessMessage("No changes to save");
      return;
    }

    setIsSubmitting(true);
    setServerError("");
    setSuccessMessage("");

    try {
      await updateMyProfile(changedFields, token);
      await refreshUser();

      setSuccessMessage("Profile updated successfully");
    } catch (requestError) {
      if (requestError.details) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          ...requestError.details,
        }));
      }

      setServerError(
        requestError.message || "Failed to update profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isAuthLoading || !user) {
    return <Loader message="Loading your profile..." />;
  }

  return (
    <section>
      <h1>My profile</h1>

      <div>
        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Account type:</strong> {user.role}
        </p>

        <p>
          <strong>Member since:</strong>{" "}
          {formatDate(user.createdAt)}
        </p>
      </div>

      <ErrorMessage message={serverError} />

      {successMessage && (
        <p role="status">{successMessage}</p>
      )}

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

        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          Save changes
        </Button>
      </form>
    </section>
  );
}

export default ProfilePage;