import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import OrderList from "../components/orders/OrderList";
import Loader from "../components/common/Loader";
import { getTailorOrders } from "../api/orders";
import "./Dashboard.css";

const TailorDashboard = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // 'pending', 'active', 'completed'
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const tailorOrders = await getTailorOrders();
        setOrders(tailorOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message || "Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderUpdate = (updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order?._id === updatedOrder?._id ? updatedOrder : order
      )
    );
  };

  const pendingOrders = orders.filter((order) => order.status === "placed");
  const activeOrders = orders.filter((order) =>
    ["accepted", "in-progress", "ready"].includes(order.status)
  );
  const completedOrders = orders.filter((order) =>
    ["delivered", "rejected"].includes(order.status)
  );

  const getOrdersToShow = () => {
    switch (activeTab) {
      case "pending":
        return pendingOrders;
      case "active":
        return activeOrders;
      case "completed":
        return completedOrders;
      default:
        return [];
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Tailor Dashboard</h1>
        <p className="subtitle">Manage your shop and orders</p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{pendingOrders.length}</h3>
          <p>New Orders</p>
        </div>

        <div className="stat-card">
          <h3>{activeOrders.length}</h3>
          <p>Active Orders</p>
        </div>

        <div className="stat-card">
          <h3>{completedOrders.length}</h3>
          <p>Completed</p>
        </div>

        <div className="stat-card">
          <h3>₹{orders.reduce((sum, order) => sum + order.price, 0)}</h3>
          <p>Total Revenue</p>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header with-tabs">
          <h2>Orders</h2>
          <div className="tabs">
            <button
              className={`tab ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              New Orders
              {pendingOrders.length > 0 && (
                <span className="badge">{pendingOrders.length}</span>
              )}
            </button>
            <button
              className={`tab ${activeTab === "active" ? "active" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              In Progress
            </button>
            <button
              className={`tab ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Completed
            </button>
          </div>
        </div>

        <OrderList
          orders={getOrdersToShow()}
          isLoading={isLoading}
          isTailorView={true}
          onOrderUpdate={handleOrderUpdate}
        />
      </div>
    </div>
  );
};

export default TailorDashboard;
