import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { getTailorById } from "../api/tailors";
import { createOrder } from "../api/orders";
import Loader from "../components/common/Loader";
import "./OrderForm.css";

const OrderForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const tailorId = searchParams.get("tailorId");

  const [tailor, setTailor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: [{ description: "", fabric: "", measurements: "", price: 0 }],
      deliveryOption: "pickup",
      paymentMethod: "cash",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");
  const totalPrice = watchedItems.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0),
    0
  );

  useEffect(() => {
    const fetchTailor = async () => {
      if (!tailorId) {
        setError("No tailor selected");
        setIsLoading(false);
        return;
      }

      try {
        const { tailor: tailorData, error: tailorError } = await getTailorById(
          tailorId
        );
        if (tailorError) {
          setError(tailorError);
        } else {
          setTailor(tailorData);
        }
      } catch (err) {
        setError("Failed to load tailor information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTailor();
  }, [tailorId]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const orderData = {
        tailorId,
        items: data.items.map((item) => ({
          ...item,
          price: parseFloat(item.price),
        })),
        deliveryOption: data.deliveryOption,
        paymentMethod: data.paymentMethod,
        price: totalPrice,
      };

      const order = await createOrder(orderData);

      navigate(`/order/${order._id}`);
    } catch (err) {
      setError("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error && !tailor) {
    return (
      <div className="error-container" role="alert">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="order-form-page">
      <div className="order-form-container">
        <div className="order-form-header">
          <h1>Place Order</h1>
          {tailor && (
            <div className="tailor-info">
              <img
                src={tailor.avatar}
                alt={tailor.userId.name}
                className="tailor-avatar"
              />
              <div>
                <h3>{tailor.userId.name}</h3>
                <p>{tailor.shopAddress}</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="order-form">
          <div className="form-section">
            <h2>Order Items</h2>

            {fields.map((field, index) => (
              <div key={field.id} className="order-item">
                <div className="item-header">
                  <h3>Item {index + 1}</h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="btn btn-error btn-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor={`items.${index}.description`}>
                      Description *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Men's Shirt, Women's Dress"
                      {...register(`items.${index}.description`, {
                        required: "Description is required",
                      })}
                    />
                    {errors.items?.[index]?.description && (
                      <p className="input-error">
                        {errors.items[index].description.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor={`items.${index}.fabric`}>Fabric *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Cotton, Silk, Polyester"
                      {...register(`items.${index}.fabric`, {
                        required: "Fabric is required",
                      })}
                    />
                    {errors.items?.[index]?.fabric && (
                      <p className="input-error">
                        {errors.items[index].fabric.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor={`items.${index}.price`}>Price (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-control"
                      placeholder="0.00"
                      {...register(`items.${index}.price`, {
                        required: "Price is required",
                        min: { value: 0, message: "Price must be positive" },
                      })}
                    />
                    {errors.items?.[index]?.price && (
                      <p className="input-error">
                        {errors.items[index].price.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor={`items.${index}.measurements`}>
                    Measurements *
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    // placeholder="Please provide detailed measurements (e.g., Chest: 40", Waist: 32", Length: 28")"
                    {...register(`items.${index}.measurements`, {
                      required: "Measurements are required",
                    })}
                  />
                  {errors.items?.[index]?.measurements && (
                    <p className="input-error">
                      {errors.items[index].measurements.message}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                append({
                  description: "",
                  fabric: "",
                  measurements: "",
                  price: 0,
                })
              }
              className="btn btn-outline"
            >
              Add Another Item
            </button>
          </div>

          <div className="form-section">
            <h2>Delivery & Payment</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Delivery Option *</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      value="pickup"
                      {...register("deliveryOption", {
                        required: "Please select delivery option",
                      })}
                    />
                    <span>Pickup from Shop</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      value="home_delivery"
                      {...register("deliveryOption", {
                        required: "Please select delivery option",
                      })}
                    />
                    <span>Home Delivery</span>
                  </label>
                </div>
                {errors.deliveryOption && (
                  <p className="input-error">{errors.deliveryOption.message}</p>
                )}
              </div>

              <div className="form-group">
                <label>Payment Method *</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      value="cash"
                      {...register("paymentMethod", {
                        required: "Please select payment method",
                      })}
                    />
                    <span>Cash</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      value="upi"
                      {...register("paymentMethod", {
                        required: "Please select payment method",
                      })}
                    />
                    <span>UPI</span>
                  </label>
                </div>
                {errors.paymentMethod && (
                  <p className="input-error">{errors.paymentMethod.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-content">
              <div className="summary-row">
                <span>Total Items:</span>
                <span>{fields.length}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || totalPrice === 0}
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
