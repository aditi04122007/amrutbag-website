import api from "./api";

// Create a new order (Authenticated user)
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

// Get current user's orders
export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data;
};

// Get specific order details
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// Admin: Get all customer orders
export const getOrders = async (params = {}) => {
  const response = await api.get("/orders", { params });
  return response.data;
};

// Admin: Update order status
export const updateOrder = async (id, statusData) => {
  const response = await api.put(`/orders/${id}/status`, statusData);
  return response.data;
};

// Admin: Delete order
export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};

// Admin: Get dashboard stats
export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};