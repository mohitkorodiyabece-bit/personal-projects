import api from './api.js';

export const createFeedback = async (versionId, payload) => {
  const { data } = await api.post(`/versions/${versionId}/feedback`, payload);
  return data;
};

export const getFeedback = async (versionId) => {
  const { data } = await api.get(`/versions/${versionId}/feedback`);
  return data;
};

export const updateFeedback = async (id, message) => {
  const { data } = await api.put(`/feedback/${id}`, { message });
  return data;
};

export const deleteFeedback = async (id) => {
  const { data } = await api.delete(`/feedback/${id}`);
  return data;
};

export const resolveFeedback = async (id) => {
  const { data } = await api.put(`/feedback/${id}/resolve`);
  return data;
};