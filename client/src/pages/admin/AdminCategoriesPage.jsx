import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../api/categoriesApi";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../hooks/useAuth";
import { validateRequired } from "../../utils/validators";

const EMPTY_FORM = {
  name: "",
  description: "",
};

function AdminCategoriesPage() {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let ignoreResult = false;

    async function loadCategories() {
      setIsLoading(true);
      setGeneralError("");

      try {
        const response = await getCategories(
          { includeInactive: true },
          token
        );

        if (!ignoreResult) {
          setCategories(response.data.categories);
        }
      } catch (requestError) {
        if (!ignoreResult) {
          setGeneralError(
            requestError.message ||
              "Failed to load categories"
          );
        }
      } finally {
        if (!ignoreResult) {
          setIsLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      ignoreResult = true;
    };
  }, [token]);

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

    setGeneralError("");
    setMessage("");
  }

  function validateForm() {
    const newErrors = {
      name: validateRequired(formData.name, "Category name"),
      description: validateRequired(
        formData.description,
        "Description"
      ),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  }

  function handleEdit(category) {
    setEditingCategory(category);

    setFormData({
      name: category.name,
      description: category.description,
    });

    setErrors({});
    setGeneralError("");
    setMessage("");
  }

  function resetForm() {
    setEditingCategory(null);
    setFormData(EMPTY_FORM);
    setErrors({});
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const cleanedData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    setIsSubmitting(true);
    setGeneralError("");
    setMessage("");

    try {
      if (editingCategory) {
        const changedFields = {};

        if (cleanedData.name !== editingCategory.name) {
          changedFields.name = cleanedData.name;
        }

        if (
          cleanedData.description !==
          editingCategory.description
        ) {
          changedFields.description =
            cleanedData.description;
        }

        if (!Object.keys(changedFields).length) {
          setMessage("No changes to save");
          setIsSubmitting(false);
          return;
        }

        const response = await updateCategory(
          editingCategory.id,
          changedFields,
          token
        );

        const updatedCategory = response.data.category;

        setCategories((currentCategories) =>
          currentCategories.map((category) =>
            category.id === updatedCategory.id
              ? updatedCategory
              : category
          )
        );

        setMessage("Category updated successfully");
      } else {
        const response = await createCategory(
          cleanedData,
          token
        );

        const createdCategory = response.data.category;

        setCategories((currentCategories) => [
          createdCategory,
          ...currentCategories,
        ]);

        setMessage("Category created successfully");
      }

      resetForm();
    } catch (requestError) {
      setErrors(requestError.details || {});
      setGeneralError(
        requestError.message || "Failed to save category"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeactivate(category) {
    const confirmed = window.confirm(
      `Deactivate "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(category.id);
    setGeneralError("");
    setMessage("");

    try {
      await deleteCategory(category.id, token);

      setCategories((currentCategories) =>
        currentCategories.map((currentCategory) =>
          currentCategory.id === category.id
            ? { ...currentCategory, isActive: false }
            : currentCategory
        )
      );

      if (editingCategory?.id === category.id) {
        resetForm();
      }

      setMessage("Category deactivated successfully");
    } catch (requestError) {
      if (requestError.code === "CATEGORY_IN_USE") {
        setGeneralError(
          "This category cannot be deactivated while it contains active products."
        );
      } else {
        setGeneralError(
          requestError.message ||
            "Failed to deactivate category"
        );
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <header>
        <h1>Categories</h1>
        <p>Manage the categories used by store products.</p>
      </header>

      <ErrorMessage message={generalError} />

      {message && <p role="status">{message}</p>}

      <section>
        <h2>
          {editingCategory
            ? "Edit category"
            : "Add category"}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <Input
            id="categoryName"
            name="name"
            label="Category name"
            type="text"
            value={formData.name}
            error={errors.name}
            onChange={handleChange}
          />

          <div>
            <label htmlFor="categoryDescription">
              Description
            </label>

            <textarea
              id="categoryDescription"
              name="description"
              rows="4"
              value={formData.description}
              aria-invalid={Boolean(errors.description)}
              onChange={handleChange}
            />

            {errors.description && (
              <span role="alert">
                {errors.description}
              </span>
            )}
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            {editingCategory
              ? "Save changes"
              : "Create category"}
          </Button>

          {editingCategory && (
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={resetForm}
            >
              Cancel
            </Button>
          )}
        </form>
      </section>

      <section>
        <h2>All categories</h2>

        {isLoading ? (
          <Loader message="Loading categories..." />
        ) : !categories.length ? (
          <EmptyState
            title="No categories found"
            message="Create the first category using the form."
          />
        ) : (
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>
                    {category.isActive
                      ? "Active"
                      : "Inactive"}
                  </td>
                  <td>
                    <Button
                      type="button"
                      disabled={
                        isSubmitting ||
                        Boolean(deletingId)
                      }
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </Button>

                    {category.isActive && (
                      <Button
                        type="button"
                        isLoading={
                          deletingId === category.id
                        }
                        disabled={Boolean(deletingId)}
                        onClick={() =>
                          handleDeactivate(category)
                        }
                      >
                        Deactivate
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </section>
  );
}

export default AdminCategoriesPage;