import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Switch, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assignRolePermissions, assignUserRoles, getPermissions, getRoles, getUsers, savePermission, saveRole } from '../api/rbac.js';
import { useAuth } from '../context/AuthContext.jsx';

export function RbacPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const [roleName, setRoleName] = useState('MANAGER');
  const [roleDescription, setRoleDescription] = useState('Can manage routine operations.');
  const [isSystem, setIsSystem] = useState(false);
  const [permissionResource, setPermissionResource] = useState('users');
  const [permissionAction, setPermissionAction] = useState('read');
  const [permissionDescription, setPermissionDescription] = useState('View users');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedUserRoleIds, setSelectedUserRoleIds] = useState([]);
  const [selectedRolePermissionIds, setSelectedRolePermissionIds] = useState([]);

  const { data: rolesData, isLoading: rolesLoading } = useQuery({ queryKey: ['roles'], queryFn: getRoles });
  const { data: permissionsData, isLoading: permissionsLoading } = useQuery({ queryKey: ['permissions'], queryFn: getPermissions });
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    enabled: Boolean(accessToken),
    queryFn: () => getUsers(accessToken)
  });

  const roleMutation = useMutation({
    mutationFn: saveRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] })
  });

  const permissionMutation = useMutation({
    mutationFn: savePermission,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permissions'] })
  });

  const userRolesMutation = useMutation({
    mutationFn: ({ userId, roleIds }) => assignUserRoles(userId, roleIds, accessToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });

  const rolePermissionsMutation = useMutation({
    mutationFn: ({ roleId, permissionIds }) => assignRolePermissions(roleId, permissionIds, accessToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] })
  });

  const roles = useMemo(() => rolesData?.items ?? [], [rolesData]);
  const permissions = useMemo(() => permissionsData?.items ?? [], [permissionsData]);
  const users = useMemo(() => usersData?.items ?? [], [usersData]);

  useEffect(() => {
    if (!roles.length) return;
    if (!selectedRoleId && roles[0]) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  useEffect(() => {
    if (!selectedUserId && users.length) {
      setSelectedUserId(users[0].id);
    }
  }, [selectedUserId, users]);

  useEffect(() => {
    if (!selectedUserId || !roles.length) return;
    const currentUser = users.find((user) => user.id === selectedUserId);
    const nextUserRoleIds = roles
      .filter((role) => currentUser?.roles?.includes(role.name))
      .map((role) => role.id);
    setSelectedUserRoleIds(nextUserRoleIds);
  }, [selectedUserId, roles, users]);

  useEffect(() => {
    if (!selectedRoleId || !roles.length) return;
    const selectedRole = roles.find((role) => role.id === selectedRoleId);
    setSelectedRolePermissionIds(selectedRole?.permissions ?? []);
  }, [selectedRoleId, roles]);

  const handleCreateRole = () => {
    roleMutation.mutate({ name: roleName, description: roleDescription, permissions: [], isSystem });
  };

  const handleCreatePermission = () => {
    permissionMutation.mutate({ resource: permissionResource, action: permissionAction, description: permissionDescription });
  };

  const handleToggleUserRole = (roleId) => {
    setSelectedUserRoleIds((current) =>
      current.includes(roleId) ? current.filter((id) => id !== roleId) : [...current, roleId]
    );
  };

  const handleToggleRolePermission = (permissionId) => {
    setSelectedRolePermissionIds((current) =>
      current.includes(permissionId) ? current.filter((id) => id !== permissionId) : [...current, permissionId]
    );
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5">RBAC management</Typography>
      <Typography color="text.secondary">Create and assign roles, permissions, and user access.</Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Create a role</Typography>
          <TextField label="Role name" value={roleName} onChange={(e) => setRoleName(e.target.value)} />
          <TextField label="Description" value={roleDescription} onChange={(e) => setRoleDescription(e.target.value)} />
          <FormControlLabel control={<Switch checked={isSystem} onChange={(e) => setIsSystem(e.target.checked)} />} label="System role" />
          <Button variant="contained" onClick={handleCreateRole} disabled={roleMutation.isPending}>
            {roleMutation.isPending ? 'Saving...' : 'Save role'}
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Create a permission</Typography>
          <TextField label="Resource" value={permissionResource} onChange={(e) => setPermissionResource(e.target.value)} />
          <TextField label="Action" value={permissionAction} onChange={(e) => setPermissionAction(e.target.value)} />
          <TextField label="Description" value={permissionDescription} onChange={(e) => setPermissionDescription(e.target.value)} />
          <Button variant="contained" onClick={handleCreatePermission} disabled={permissionMutation.isPending}>
            {permissionMutation.isPending ? 'Saving...' : 'Save permission'}
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Assign roles to users</Typography>
        {usersLoading ? <CircularProgress size={20} /> : (
          <Stack spacing={2} mt={2}>
            <FormControl fullWidth>
              <InputLabel id="user-select-label">User</InputLabel>
              <Select labelId="user-select-label" value={selectedUserId} label="User" onChange={(e) => setSelectedUserId(e.target.value)}>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>{`${user.firstName} ${user.lastName} (${user.email})`}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {rolesLoading ? <CircularProgress size={20} /> : (
              <Stack spacing={1}>
                {roles.map((role) => (
                  <FormControlLabel
                    key={role.id}
                    control={<Checkbox checked={selectedUserRoleIds.includes(role.id)} onChange={() => handleToggleUserRole(role.id)} />}
                    label={`${role.name} ${role.isSystem ? '(system)' : ''}`}
                  />
                ))}
              </Stack>
            )}
            <Button variant="contained" onClick={() => userRolesMutation.mutate({ userId: selectedUserId, roleIds: selectedUserRoleIds })} disabled={!selectedUserId || userRolesMutation.isPending}>
              {userRolesMutation.isPending ? 'Saving...' : 'Save user roles'}
            </Button>
          </Stack>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Assign permissions to roles</Typography>
        {rolesLoading || permissionsLoading ? <CircularProgress size={20} /> : (
          <Stack spacing={2} mt={2}>
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select labelId="role-select-label" value={selectedRoleId} label="Role" onChange={(e) => setSelectedRoleId(e.target.value)}>
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack spacing={1}>
              {permissions.map((permission) => (
                <FormControlLabel
                  key={permission.id}
                  control={<Checkbox checked={selectedRolePermissionIds.includes(permission.id)} onChange={() => handleToggleRolePermission(permission.id)} />}
                  label={`${permission.resource}:${permission.action}`}
                />
              ))}
            </Stack>
            <Button variant="contained" onClick={() => rolePermissionsMutation.mutate({ roleId: selectedRoleId, permissionIds: selectedRolePermissionIds })} disabled={!selectedRoleId || rolePermissionsMutation.isPending}>
              {rolePermissionsMutation.isPending ? 'Saving...' : 'Save role permissions'}
            </Button>
          </Stack>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Roles</Typography>
        {rolesLoading ? <CircularProgress size={20} /> : (
          <Stack spacing={1} mt={2}>
            {roles.map((role) => (
              <Box key={role.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{role.name}</Typography>
                <Chip label={role.isSystem ? 'System' : 'Custom'} size="small" />
              </Box>
            ))}
          </Stack>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Permissions</Typography>
        {permissionsLoading ? <CircularProgress size={20} /> : (
          <Stack spacing={1} mt={2}>
            {permissions.map((permission) => (
              <Box key={permission.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{permission.resource}:{permission.action}</Typography>
                <Chip label={permission.description} size="small" />
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
