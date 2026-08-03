import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../../api/ordersApi";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatCurrency";
import { validateRequired } from "../../utils/validators";

function CheckoutPage() {
  const { token } = useAuth();
  const {
    cart,
    isLoading: isCartLoading,
    refreshCart,
  } = useCart();

  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    city: "",
    street: "",
    houseNumber: "",
    apartment: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setShippingAddress((currentAddress) => ({
      ...currentAddress,
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
      city: validateRequired(shippingAddress.city, "City"),
      street: validateRequired(
        shippingAddress.street,
        "Street"
      ),
      houseNumber: validateRequired(
        shippingAddress.houseNumber,
        "House number"
      ),
      postalCode: validateRequired(
        shippingAddress.postalCode,
        "Postal code"
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

    setIsSubmitting(true);
    setServerError("");

    try {
      const cleanedAddress = {
        city: shippingAddress.city.trim(),
        street: shippingAddress.street.trim(),
        houseNumber: shippingAddress.houseNumber.trim(),
        apartment: shippingAddress.apartment.trim(),
        postalCode: shippingAddress.postalCode.trim(),
      };

      const response = await createOrder(
        cleanedAddress,
        token
      );

      const createdOrder = response.data.order;

      await refreshCart();

      navigate("/orders", {
        replace: true,
        state: {
          message: `Order #${createdOrder.id} was created successfully`,
        },
      });
    } catch (requestError) {
      if (requestError.details) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          ...requestError.details,
        }));
      }

      setServerError(
        requestError.message || "Failed to create order"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCartLoading && !cart.items.length) {
    return <Loader message="Loading checkout..." />;
  }

  if (!cart.items.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Add products to your cart before checking out."
        action={<Link to="/products">Browse products</Link>}
      />
    );
  }

  return (
    <section>
      <h1>Checkout</h1>

      <ErrorMessage message={serverError} />

      <div>
        <form onSubmit={handleSubmit} noValidate>
          <h2>Shipping address</h2>

          <Input
            id="city"
            label="City"
            type="text"
            autoComplete="address-level2"
            value={shippingAddress.city}
            error={errors.city}
            onChange={handleChange}
          />

          <Input
            id="street"
            label="Street"
            type="text"
            autoComplete="address-line1"
            value={shippingAddress.street}
            error={errors.street}
            onChange={handleChange}
          />

          <Input
            id="houseNumber"
            label="House number"
            type="text"
            value={shippingAddress.houseNumber}
            error={errors.houseNumber}
            onChange={handleChange}
          />

          <Input
            id="apartment"
            label="Apartment (optional)"
            type="text"
            value={shippingAddress.apartment}
            error={errors.apartment}
            onChange={handleChange}
          />

          <Input
            id="postalCode"
            label="Postal code"
            type="text"
            autoComplete="postal-code"
            value={shippingAddress.postalCode}
            error={errors.postalCode}
            onChange={handleChange}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Place order
          </Button>
        </form>

        <aside>
          <h2>Order summary</h2>

          <ul>
            {cart.items.map((item) => (
              <li key={item.productId}>
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>
                  {formatCurrency(item.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <strong>
            Total: {formatCurrency(cart.totalPrice)}
          </strong>
        </aside>
      </div>
    </section>
  );
}

export default CheckoutPage;