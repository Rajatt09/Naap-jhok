import { Link } from "react-router-dom";
import { updateOrderStatus } from "../../api/orders";
import { useState } from "react";
import "./OrderList.css";

const OrderStatusBadge = ({ status }) => {
  let statusClass = "";
  let statusText = "";

  switch (status) {
    case "placed":
      statusClass = "status-placed";
      statusText = "Placed";
      break;
    case "accepted":
      statusClass = "status-accepted";
      statusText = "Accepted";
      break;
    case "in-progress":
      statusClass = "status-in-progress";
      statusText = "In Progress";
      break;
    case "ready":
      statusClass = "status-ready";
      statusText = "Ready";
      break;
    case "delivered":
      statusClass = "status-delivered";
      statusText = "Delivered";
      break;
    case "rejected":
      statusClass = "status-rejected";
      statusText = "Rejected";
      break;
    default:
      statusClass = "status-placed";
      statusText = "Placed";
  }

  return <span className={`status-pill ${statusClass}`}>{statusText}</span>;
};

const OrderList = ({
  orders,
  isLoading,
  isTailorView = false,
  onOrderUpdate,
}) => {
  const [updatingOrders, setUpdatingOrders] = useState(new Set());

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingOrders((prev) => new Set([...prev, orderId]));

      const order = await updateOrderStatus(orderId, newStatus);

      if (onOrderUpdate) {
        onOrderUpdate(order);
      }
    } catch (err) {
      alert("Failed to update order status");
    } finally {
      setUpdatingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <span className="loading-spinner"></span>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (orders?.length === 0) {
    return (
      <div className="empty-orders">
        <div className="empty-icon">📋</div>
        <h3>No orders yet</h3>
        <p>
          {isTailorView
            ? "You haven't received any orders yet. When customers place orders, they'll appear here."
            : "You haven't placed any orders yet. Find a tailor to get started!"}
        </p>
        {!isTailorView && (
          // <Link to="/" className="btn btn-primary">
          //   Find Tailors
          // </Link>
          <Link
            to={`/order/new?id=6841d3620e3b66bfd0da7978`}
            className="btn btn-outline"
          >
            Place order Now
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="order-list">
      {orders?.map((order) => (
        <div key={order._id} className="order-item fade-in">
          <div className="order-header">
            <div className="order-id">
              <span className="order-label">Order #</span>
              <span className="order-value">{order._id.slice(-8)}</span>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="order-summary">
            <div className="order-details">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-detail">
                  <span className="item-description">{item.description}</span>
                  <span className="item-price">₹{item.price}</span>
                </div>
              ))}
            </div>

            <div className="order-meta">
              <div className="meta-item">
                <span className="meta-label">Date:</span>
                <span className="meta-value">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Delivery:</span>
                <span className="meta-value">
                  {order.deliveryOption === "home_delivery"
                    ? "Home Delivery"
                    : "Pickup"}
                </span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Payment:</span>
                <span className="meta-value">
                  {order.paymentMethod === "cash" ? "Cash" : "UPI"}
                </span>
              </div>

              <div className="meta-item total">
                <span className="meta-label">Total:</span>
                <span className="meta-value">₹{order.price}</span>
              </div>
            </div>
          </div>

          <div className="order-footer">
            <Link to={`/order/${order._id}`} className="btn btn-primary btn-sm">
              View Details
            </Link>

            {isTailorView && order.status === "placed" && (
              <div className="tailor-actions">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleStatusUpdate(order._id, "accepted")}
                  disabled={updatingOrders.has(order._id)}
                >
                  {updatingOrders.has(order._id) ? "Accepting..." : "Accept"}
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => handleStatusUpdate(order._id, "rejected")}
                  disabled={updatingOrders.has(order._id)}
                >
                  {updatingOrders.has(order._id) ? "Rejecting..." : "Reject"}
                </button>
              </div>
            )}

            {isTailorView && order.status === "accepted" && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleStatusUpdate(order._id, "in-progress")}
                disabled={updatingOrders.has(order._id)}
              >
                {updatingOrders.has(order._id)
                  ? "Updating..."
                  : "Mark as In Progress"}
              </button>
            )}

            {isTailorView && order.status === "in-progress" && (
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleStatusUpdate(order._id, "ready")}
                disabled={updatingOrders.has(order._id)}
              >
                {updatingOrders.has(order._id)
                  ? "Updating..."
                  : "Mark as Ready"}
              </button>
            )}

            {isTailorView && order.status === "ready" && (
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleStatusUpdate(order._id, "delivered")}
                disabled={updatingOrders.has(order._id)}
              >
                {updatingOrders.has(order._id)
                  ? "Updating..."
                  : "Mark as Delivered"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
