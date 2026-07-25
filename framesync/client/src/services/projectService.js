import api from './api.js';

export const createProject = async (formData) => {
  const { data } = await api.post('/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getProjects = async (params = {}) => {
  const { data } = await api.get('/projects', { params });
  return data;
};

export const getProjectById = async (id) => {
  const { data } = await api.get(`/projects/${id}`);
  return data;
};

export const updateProject = async (id, formData) => {
  const { data } = await api.put(`/projects/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};

export const updateProjectStatus = async (id, status) => {
  const { data } = await api.put(`/projects/${id}/status`, { status });
  return data;
};

export const assignEditor = async (id, editorId) => {
  const { data } = await api.put(`/projects/${id}/assign`, { editorId });
  return data;
};

export const submitFinalDelivery = async (id, finalDeliveryLink) => {
  const { data } = await api.put(`/projects/${id}/final-delivery`, {
    finalDeliveryLink,
  });
  return data;
};

export const approveProject = async (id) => {
  const { data } = await api.put(`/projects/${id}/approve`);
  return data;
};