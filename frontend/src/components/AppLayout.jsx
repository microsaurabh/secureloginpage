import { AppBar, Box, Button, Chip, Container, Stack, Toolbar, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getHealthStatus } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';

export function AppLayout({ children, mode, toggleMode }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn: getHealthStatus,
    refetchInterval: 60_000
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Typography component="h1" variant="h6" sx={{ flexGrow: 1 }}>
            Secure Login Portal
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button component={RouterLink} to="/dashboard" color="inherit">
              Dashboard
            </Button>
            <Button component={RouterLink} to="/profile" color="inherit">
              Profile
            </Button>
            <Button component={RouterLink} to="/users" color="inherit">
              Users
            </Button>
            <Button color="inherit" onClick={toggleMode}>
              {mode === 'light' ? 'Dark mode' : 'Light mode'}
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 3 }}>
          <Stack spacing={0.5}>
            <Typography variant="h4">Welcome back</Typography>
            <Typography color="text.secondary">{user?.email ?? 'Authenticated user'}</Typography>
          </Stack>
          <Chip label={health?.status ?? 'Checking service status'} color="success" variant="outlined" />
        </Stack>
        {children}
      </Container>
    </Box>
  );
}
