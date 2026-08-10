import api from './api.js';

export const getClientDashboard = async () => {
  const { data } = await api.get('/dashboard/client');
  return data;
};

export const getEditorDashboard = async () => {
  const { data } = await api.get('/dashboard/editor');
  return data;
};

export const getAdminDashboard = async () => {
  const { data } = await api.get('/dashboard/admin');
  return data;
};