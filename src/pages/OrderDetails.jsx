import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrderById, updateOrderStatus } from "../api/orders";
import { getTailorById } from "../api/tailors";
import Loader from "../components/common/Loader";
import "./OrderDetails.css";

const OrderDetails = () => {
  const { id } = useParams();
  const { currentUser, isTailor } = useAuth();
  const [order, setOrder] = useState(null);
  const [tailor, setTailor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const order = await getOrderById(id);

        setOrder(order);
        setTailor(order.tailorId);

        // Only fetch tailor info if we're not the tailor viewing this
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isTailor]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setIsUpdating(true);
      setError(null);

      const updatedOrder = await updateOrderStatus(id, newStatus);

      setOrder(updatedOrder);
    } catch (err) {
      setError("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderStatusActions = () => {
    if (!isTailor) return null;

    switch (order.status) {
      case "placed":
        return (
          <div className="status-actions">
            <button
              className="btn btn-success"
              onClick={() => handleStatusUpdate("accepted")}
              disabled={isUpdating}
            >
              {isUpdating ? "Accepting..." : "Accept Order"}
            </button>
            <button
              className="btn btn-error"
              onClick={() => handleStatusUpdate("rejected")}
              disabled={isUpdating}
            >
              {isUpdating ? "Rejecting..." : "Reject Order"}
            </button>
          </div>
        );
      case "accepted":
        return (
          <div className="status-actions">
            <button
              className="btn btn-primary"
              onClick={() => handleStatusUpdate("in-progress")}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Mark as In Progress"}
            </button>
          </div>
        );
      case "in-progress":
        return (
          <div className="status-actions">
            <button
              className="btn btn-primary"
              onClick={() => handleStatusUpdate("ready")}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Mark as Ready for Delivery/Pickup"}
            </button>
          </div>
        );
      case "ready":
        return (
          <div className="status-actions">
            <button
              className="btn btn-success"
              onClick={() => handleStatusUpdate("delivered")}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Mark as Delivered/Picked Up"}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const getTimelineStatus = (status) => {
    const statuses = [
      "placed",
      "accepted",
      "in-progress",
      "ready",
      "delivered",
    ];
    const currentIndex = statuses.indexOf(order.status);
    const statusIndex = statuses.indexOf(status);

    if (order.status === "rejected") {
      return status === "placed" ? "completed" : "";
    }

    return statusIndex <= currentIndex ? "completed" : "";
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="error-container\" role="alert">
        <h2>Error</h2>
        <p>{error}</p>
        <Link
          to={isTailor ? "/tailor-dashboard" : "/dashboard"}
          className="btn btn-primary"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-container">
        <h2>Order not found</h2>
        <p>
          The order you're looking for doesn't exist or you don't have
          permission to view it.
        </p>
        <Link
          to={isTailor ? "/tailor-dashboard" : "/dashboard"}
          className="btn btn-primary"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <div className="back-link">
        <Link to={isTailor ? "/tailor-dashboard" : "/dashboard"}>
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="order-details-container">
        <div className="order-details-header">
          <div>
            <h1>Order #{order._id.slice(-8)}</h1>
            <p className="order-date">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="order-status-container">
            <span className={`status-pill status-${order.status}`}>
              {order.status.replace("-", " ")}
            </span>
          </div>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        <div className="order-sections">
          <div className="order-main-section">
            <div className="order-card">
              <h2>Items</h2>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item-row">
                    <div className="item-info">
                      <h3>{item.description}</h3>
                      <p className="fabric">Fabric: {item.fabric}</p>
                      <div className="measurement-details">
                        <h4>Measurements:</h4>
                        <p>{item.measurements}</p>
                      </div>
                    </div>
                    <div className="item-price">₹{item.price}</div>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <span>Total</span>
                <span>₹{order.price}</span>
              </div>
            </div>

            <div className="order-card">
              <h2>Delivery Information</h2>
              <div className="delivery-info">
                <div className="info-row">
                  <span className="info-label">Delivery Option:</span>
                  <span className="info-value">
                    {order.deliveryOption === "home_delivery"
                      ? "Home Delivery"
                      : "Pickup from Shop"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Payment Method:</span>
                  <span className="info-value">
                    {order.paymentMethod === "cash" ? "Cash" : "UPI"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Customer Address:</span>
                  <span className="info-value">{order.userId.address}</span>
                </div>
              </div>
            </div>

            {(tailor || order.tailorId) && (
              <div className="order-card">
                <h2>Tailor Information</h2>
                <div className="tailor-info">
                  {tailor ? (
                    <>
                      <img
                        src={
                          tailor.avatar ||
                          "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150"
                        }
                        alt={tailor.userId.name}
                        className="tailor-avatar"
                      />
                      <div>
                        <h3>{tailor.userId.name}</h3>
                        <p>{tailor.shopAddress}</p>
                        <p className="tailor-contact">
                          Phone: {tailor.userId.phone}
                        </p>
                        <Link
                          to={`/tailor/${tailor._id}`}
                          className="btn btn-outline btn-sm"
                        >
                          View Shop
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div>
                      <h3>{order.tailorId.name || "Tailor"}</h3>
                      <p>
                        {order.tailorId.shopAddress ||
                          "Shop address not available"}
                      </p>
                      <p className="tailor-contact">
                        Phone: {order.tailorId.phone || "Not available"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="order-side-section">
            <div className="order-card">
              <h2>Order Timeline</h2>
              <div className="order-timeline">
                <div className={`timeline-item ${getTimelineStatus("placed")}`}>
                  <div className="timeline-point"></div>
                  <div className="timeline-content">
                    <h4>Order Placed</h4>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {order.status !== "rejected" && (
                  <>
                    <div
                      className={`timeline-item ${getTimelineStatus(
                        "accepted"
                      )}`}
                    >
                      <div className="timeline-point"></div>
                      <div className="timeline-content">
                        <h4>Order Accepted</h4>
                        <p>
                          {getTimelineStatus("accepted") === "completed"
                            ? "Tailor has accepted your order"
                            : "Waiting for tailor to accept"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`timeline-item ${getTimelineStatus(
                        "in-progress"
                      )}`}
                    >
                      <div className="timeline-point"></div>
                      <div className="timeline-content">
                        <h4>In Progress</h4>
                        <p>
                          {getTimelineStatus("in-progress") === "completed"
                            ? "Stitching in progress"
                            : "Not started yet"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`timeline-item ${getTimelineStatus("ready")}`}
                    >
                      <div className="timeline-point"></div>
                      <div className="timeline-content">
                        <h4>Ready</h4>
                        <p>
                          {getTimelineStatus("ready") === "completed"
                            ? "Ready for delivery/pickup"
                            : "Waiting for completion"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`timeline-item ${getTimelineStatus(
                        "delivered"
                      )}`}
                    >
                      <div className="timeline-point"></div>
                      <div className="timeline-content">
                        <h4>Delivered</h4>
                        <p>
                          {getTimelineStatus("delivered") === "completed"
                            ? "Order completed successfully"
                            : "Waiting for delivery/pickup"}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {order.status === "rejected" && (
                  <div className="timeline-item completed">
                    <div className="timeline-point"></div>
                    <div className="timeline-content">
                      <h4>Order Rejected</h4>
                      <p>Tailor was unable to accept this order</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {renderStatusActions()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
