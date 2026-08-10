import api from './api.js';

export const getProfile = async () => {
  const { data } = await api.get('/users/profile');
  return data;
};

export const updateProfile = async (formData) => {
  const { data } = await api.put('/users/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getEditors = async () => {
  const { data } = await api.get('/users/editors');
  return data;
};

export const getAllUsers = async (params = {}) => {
  const { data } = await api.get('/users', { params });
  return data;
};

export const updateUserRole = async (id, role) => {
  const { data } = await api.put(`/users/${id}/role`, { role });
  return data;
};

export const updateUserStatus = async (id, isActive) => {
  const { data } = await api.put(`/users/${id}/status`, { isActive });
  return data;
};