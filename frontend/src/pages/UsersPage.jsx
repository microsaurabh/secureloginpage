import { Alert, Box, Card, CardContent, Chip, Pagination, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiClient } from '../api/client.js';

export function UsersPage() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get('/users', {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
          params: { page, search, limit: 10 }
        });
        setUsers(data.data.items ?? []);
        setTotalPages(Math.max(1, Math.ceil((data.data.total ?? 0) / 10)));
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err?.response?.data?.error?.message ?? 'Unable to load users');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (accessToken) {
      loadUsers();
    }

    return () => controller.abort();
  }, [accessToken, page, search]);

  const content = useMemo(() => {
    if (loading) return <Typography color="text.secondary">Loading users…</Typography>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!users.length) return <Typography color="text.secondary">No users found.</Typography>;
    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip label={user.status ?? 'active'} color={user.status === 'active' ? 'success' : 'default'} variant="outlined" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }, [error, loading, users]);

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
            <Typography variant="h5">Users</Typography>
            <TextField label="Search users" size="small" value={search} onChange={(event) => setSearch(event.target.value)} />
          </Stack>
          {content}
          <Box display="flex" justifyContent="flex-end">
            <Pagination count={totalPages} page={page - 1} onChange={(_event, value) => setPage(value)} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
