import { useEffect, useState } from "react";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import Input from "../common/Input";
import { validateRequired } from "../../utils/validators";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  categoryId: "",
  image: null,
};

function ProductForm({
  initialValues = null,
  categories,
  onSubmit,
  isSubmitting,
  serverErrors = {},
}) {
  const isEditing = Boolean(initialValues?.id);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name ?? "",
        description: initialValues.description ?? "",
        price: initialValues.price ?? "",
        stockQuantity: initialValues.stockQuantity ?? "",
        categoryId: initialValues.categoryId ?? "",
        image: null,
      });
    } else {
      setFormData(EMPTY_FORM);
    }

    setErrors({});
    setFormError("");
  }, [initialValues]);

  function handleChange(event) {
    const { name, value, files } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: files ? files[0] ?? null : value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setFormError("");
  }

  function validateForm() {
    const newErrors = {
      name: validateRequired(formData.name, "Product name"),
      description: validateRequired(
        formData.description,
        "Description"
      ),
      categoryId: formData.categoryId
        ? ""
        : "Category is required",
    };

    const numericPrice = Number(formData.price);
    const numericStock = Number(formData.stockQuantity);

    if (formData.price === "") {
      newErrors.price = "Price is required";
    } else if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      newErrors.price = "Price must be greater than zero";
    }

    if (formData.stockQuantity === "") {
      newErrors.stockQuantity = "Stock quantity is required";
    } else if (
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      newErrors.stockQuantity =
        "Stock quantity must be a non-negative whole number";
    }

    if (!isEditing && !formData.image) {
      newErrors.image = "Product image is required";
    }

    if (
      formData.image &&
      !formData.image.type.startsWith("image/")
    ) {
      newErrors.image = "Please select a valid image file";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  }

  function appendCreateFields(requestData) {
    requestData.append("name", formData.name.trim());
    requestData.append(
      "description",
      formData.description.trim()
    );
    requestData.append("price", String(Number(formData.price)));
    requestData.append(
      "stockQuantity",
      String(Number(formData.stockQuantity))
    );
    requestData.append(
      "categoryId",
      String(formData.categoryId)
    );
  }

  function appendChangedFields(requestData) {
    const trimmedName = formData.name.trim();
    const trimmedDescription = formData.description.trim();
    const numericPrice = Number(formData.price);
    const numericStock = Number(formData.stockQuantity);
    const numericCategoryId = Number(formData.categoryId);

    if (trimmedName !== initialValues.name) {
      requestData.append("name", trimmedName);
    }

    if (trimmedDescription !== initialValues.description) {
      requestData.append("description", trimmedDescription);
    }

    if (numericPrice !== Number(initialValues.price)) {
      requestData.append("price", String(numericPrice));
    }

    if (
      numericStock !== Number(initialValues.stockQuantity)
    ) {
      requestData.append(
        "stockQuantity",
        String(numericStock)
      );
    }

    if (
      numericCategoryId !== Number(initialValues.categoryId)
    ) {
      requestData.append(
        "categoryId",
        String(numericCategoryId)
      );
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const requestData = new FormData();

    if (isEditing) {
      appendChangedFields(requestData);
    } else {
      appendCreateFields(requestData);
    }

    if (formData.image) {
      requestData.append("image", formData.image);
    }

    if (isEditing && !Array.from(requestData.keys()).length) {
      setFormError("No changes to save");
      return;
    }

    setFormError("");
    await onSubmit(requestData);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ErrorMessage message={formError} />

      <Input
        id="name"
        label="Product name"
        type="text"
        value={formData.name}
        error={errors.name || serverErrors.name}
        onChange={handleChange}
      />

      <div>
        <label htmlFor="description">Description</label>

        <textarea
          id="description"
          name="description"
          rows="5"
          value={formData.description}
          aria-invalid={Boolean(
            errors.description || serverErrors.description
          )}
          onChange={handleChange}
        />

        {(errors.description ||
          serverErrors.description) && (
          <span role="alert">
            {errors.description || serverErrors.description}
          </span>
        )}
      </div>

      <Input
        id="price"
        label="Price"
        type="number"
        min="0.01"
        step="0.01"
        value={formData.price}
        error={errors.price || serverErrors.price}
        onChange={handleChange}
      />

      <Input
        id="stockQuantity"
        label="Stock quantity"
        type="number"
        min="0"
        step="1"
        value={formData.stockQuantity}
        error={
          errors.stockQuantity ||
          serverErrors.stockQuantity
        }
        onChange={handleChange}
      />

      <div>
        <label htmlFor="categoryId">Category</label>

        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          aria-invalid={Boolean(
            errors.categoryId || serverErrors.categoryId
          )}
          onChange={handleChange}
        >
          <option value="">Select a category</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {(errors.categoryId ||
          serverErrors.categoryId) && (
          <span role="alert">
            {errors.categoryId || serverErrors.categoryId}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="image">
          {isEditing
            ? "Replace image (optional)"
            : "Product image"}
        </label>

        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
        />

        {(errors.image || serverErrors.image) && (
          <span role="alert">
            {errors.image || serverErrors.image}
          </span>
        )}
      </div>

      {isEditing && initialValues.imageUrl && (
        <div>
          <p>Current image</p>
          <img
            src={initialValues.imageUrl}
            alt={initialValues.name}
          />
        </div>
      )}

      <Button type="submit" isLoading={isSubmitting}>
        {isEditing ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}

export default ProductForm;