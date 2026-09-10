import api from "./api";

// Get all products with optional filters
export const getProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};

// Get all unique categories
export const getCategories = async () => {
  const response = await api.get("/products/categories");
  return response.data;
};

// Get single product details + related items
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Admin: Add new product
export const createProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};

// Admin: Update product
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

// Admin: Delete product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};