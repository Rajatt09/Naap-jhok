import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OrderList from "../components/orders/OrderList";
import Loader from "../components/common/Loader";
import { getUserOrders } from "../api/orders";
import "./Dashboard.css";

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // 'active' or 'completed'
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const userOrders = await getUserOrders();
        setOrders(userOrders);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const activeOrders = orders.filter(
    (order) => !["delivered", "rejected"].includes(order.status)
  );

  const completedOrders = orders.filter((order) =>
    ["delivered", "rejected"].includes(order.status)
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {currentUser?.name}</h1>
        <p className="subtitle">Manage your orders and find tailors</p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{activeOrders.length}</h3>
          <p>Active Orders</p>
        </div>

        <div className="stat-card">
          <h3>{completedOrders.length}</h3>
          <p>Completed Orders</p>
        </div>

        <div className="stat-card">
          <h3>₹{orders.reduce((sum, order) => sum + order.price, 0)}</h3>
          <p>Total Spent</p>
        </div>

        <div className="stat-card">
          <h3>{orders.filter((o) => o.status === "delivered").length}</h3>
          <p>Successful Orders</p>
        </div>
      </div>

      <div className="quick-actions">
        {/* <Link to="/" className="action-card">
          <div className="action-icon">🔍</div>
          <span>Find Tailors</span>
        </Link> */}

        <Link to="/profile" className="action-card">
          <div className="action-icon">👤</div>
          <span>My Profile</span>
        </Link>
      </div>

      <div className="dashboard-section">
        <div className="section-header with-tabs">
          <h2>My Orders</h2>
          <div className="tabs">
            <button
              className={`tab ${activeTab === "active" ? "active" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              Active Orders
              {activeOrders.length > 0 && (
                <span className="badge">{activeOrders.length}</span>
              )}
            </button>
            <button
              className={`tab ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Completed
            </button>
          </div>
        </div>

        {activeTab === "active" ? (
          <OrderList orders={activeOrders} isLoading={isLoading} />
        ) : (
          <OrderList orders={completedOrders} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
