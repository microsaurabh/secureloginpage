import { apiClient } from './client.js';

export function getApiErrorMessage(error) {
  return error?.response?.data?.error?.message ?? error?.message ?? 'Request failed';
}

export async function registerAccount(payload) {
  const { data } = await apiClient.post('/auth/register', payload);
  return data.data;
}

export async function loginUser(payload) {
  const { data } = await apiClient.post('/auth/login', payload);
  return data.data;
}

export async function logoutUser() {
  await apiClient.post('/auth/logout');
}

export async function requestPasswordReset(email) {
  await apiClient.post('/auth/forgot-password', { email });
}

export async function resetPassword(payload) {
  await apiClient.post('/auth/reset-password', payload);
}

export async function changePassword(payload) {
  await apiClient.post('/auth/change-password', payload);
}

export async function getHealthStatus() {
  const { data } = await apiClient.get('/health');
  return data.data;
}
