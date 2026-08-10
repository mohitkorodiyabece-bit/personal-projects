import api from './api.js';

export const uploadVersion = async (projectId, formData) => {
  const { data } = await api.post(`/projects/${projectId}/versions`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getVersions = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/versions`);
  return data;
};

export const getVersionById = async (id) => {
  const { data } = await api.get(`/versions/${id}`);
  return data;
};

export const deleteVersion = async (id) => {
  const { data } = await api.delete(`/versions/${id}`);
  return data;
};