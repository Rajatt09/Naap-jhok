import React, { useState, useEffect } from "react";
import { getAllOrders } from "../api/orders";
import Loader from "../components/common/Loader";
import "./AdminPortal.css";

export const AdminPortal = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="admin-portal">
      <h1 className="admin-title">📦 Orders Dashboard</h1>

      {isLoading && <Loader />}
      {error && <p className="error">{error}</p>}

      {!isLoading && !error && orders.length === 0 && (
        <p className="no-orders">No orders found.</p>
      )}

      <div className="orders-grid">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-header">
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
              <span className="order-date">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="order-info">
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>User ID:</strong> {order.userId}
              </p>
              <p>
                <strong>Tailor ID:</strong> {order.tailorId}
              </p>
              <p>
                <strong>Delivery:</strong> {order.deliveryOption}
              </p>
              <p>
                <strong>Payment:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Total Price:</strong> ₹{order.price}
              </p>
            </div>

            <div className="order-items">
              <h4>Items:</h4>
              {order.items.map((item, idx) => (
                <div key={item._id || idx} className="item-card">
                  <p>
                    <strong>{item.description}</strong>
                  </p>
                  <p>Fabric: {item.fabric}</p>
                  <p>Measurements: {item.measurements}</p>
                  <p>Price: ₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
