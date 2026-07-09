import axiosInstance from './axiosInstance';
import { FETCH_LIMIT } from '../utils/constants';

export const getProducts = async () => {
  const response = await axiosInstance.get(`/products?limit=${FETCH_LIMIT}&skip=0`);
  return response.data;
};

export const getCategories = async () => {
  const response = await axiosInstance.get('/products/categories');
  return response.data;
};

export const getProductsByCategory = async (category) => {
  const response = await axiosInstance.get(`/products/category/${encodeURIComponent(category)}?limit=${FETCH_LIMIT}&skip=0`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};
