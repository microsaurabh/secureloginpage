import { apiClient } from './client.js';

export async function getRoles() {
  const { data } = await apiClient.get('/roles');
  return data;
}

export async function getRole(id) {
  const { data } = await apiClient.get(`/roles/${id}`);
  return data;
}

export async function saveRole(payload) {
  const { data } = await apiClient.post('/roles', payload);
  return data;
}

export async function deleteRole(id) {
  await apiClient.delete(`/roles/${id}`);
}

export async function getPermissions() {
  const { data } = await apiClient.get('/permissions');
  return data;
}

export async function savePermission(payload) {
  const { data } = await apiClient.post('/permissions', payload);
  return data;
}

export async function deletePermission(id) {
  await apiClient.delete(`/permissions/${id}`);
}

export async function getUsers(accessToken) {
  const { data } = await apiClient.get('/users', {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { limit: 100 }
  });
  return data.data;
}

export async function assignUserRoles(userId, roleIds, accessToken) {
  const { data } = await apiClient.post(`/users/${userId}/roles`, { roles: roleIds }, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return data.data;
}

export async function assignRolePermissions(roleId, permissionIds, accessToken) {
  const { data } = await apiClient.post(`/roles/${roleId}/permissions`, { permissions: permissionIds }, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return data.data;
}
