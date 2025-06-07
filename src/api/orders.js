import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getUserOrders = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/orders/user`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};

export const getTailorOrders = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/orders/tailor`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/orders/${orderId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch order");
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/orders`,
      orderData,
      getAuthHeaders()
    );
    console.log("Order created successfully:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create order");
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/orders/${orderId}/status`,
      { status },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update order status"
    );
  }
};
