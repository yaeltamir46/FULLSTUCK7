import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { getCategories } from "../../api/categoriesApi";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../api/productsApi";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import ProductForm from "../../components/products/ProductForm";
import { useAuth } from "../../hooks/useAuth";

function AdminProductFormPage() {
  const { productId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const isEditing = Boolean(productId);

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [serverErrors, setServerErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignoreResult = false;

    async function loadFormData() {
      setIsLoading(true);
      setGeneralError("");

      try {
        const categoriesPromise = getCategories(
          { includeInactive: true },
          token
        );

        const productPromise = isEditing
          ? getProductById(productId)
          : Promise.resolve(null);

        const [categoriesResponse, productResponse] =
          await Promise.all([
            categoriesPromise,
            productPromise,
          ]);

        if (!ignoreResult) {
          setCategories(
            categoriesResponse.data.categories
          );

          if (productResponse) {
            setProduct(productResponse.data.product);
          }
        }
      } catch (requestError) {
        if (!ignoreResult) {
          setGeneralError(
            requestError.message ||
              "Failed to load product form"
          );
        }
      } finally {
        if (!ignoreResult) {
          setIsLoading(false);
        }
      }
    }

    loadFormData();

    return () => {
      ignoreResult = true;
    };
  }, [isEditing, productId, token]);

  async function handleSubmit(formData) {
    setIsSubmitting(true);
    setServerErrors({});
    setGeneralError("");

    try {
      if (isEditing) {
        await updateProduct(productId, formData, token);
      } else {
        await createProduct(formData, token);
      }

      navigate("/admin/products", {
        replace: true,
        state: {
          message: isEditing
            ? "Product updated successfully"
            : "Product created successfully",
        },
      });
    } catch (requestError) {
      setServerErrors(requestError.details || {});
      setGeneralError(
        requestError.message || "Failed to save product"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <Loader message="Loading product form..." />;
  }

  return (
    <section>
      <Link to="/admin/products">← Back to products</Link>

      <h1>
        {isEditing ? "Edit product" : "Add product"}
      </h1>

      <ErrorMessage message={generalError} />

      {!generalError || product ? (
        <ProductForm
          initialValues={product}
          categories={categories}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          serverErrors={serverErrors}
        />
      ) : null}
    </section>
  );
}

export default AdminProductFormPage;