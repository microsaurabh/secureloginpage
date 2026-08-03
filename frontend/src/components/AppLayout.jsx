import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHealthStatus } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: '▦' },
  { to: '/profile', label: 'Profile', icon: '◉' },
  { to: '/users', label: 'Users', icon: '♙' },
  { to: '/rbac', label: 'Access control', icon: '◇', restricted: true }
];

function NavButton({ item, selected, onClick, compact = false }) {
  return (
    <Tooltip title={item.label} arrow>
      <ListItemButton
        component={RouterLink}
        to={item.to}
        selected={selected}
        onClick={onClick}
        aria-label={item.label}
        sx={{
          borderRadius: 2,
          minWidth: compact ? 44 : undefined,
          justifyContent: compact ? 'center' : 'flex-start'
        }}
      >
        <ListItemIcon sx={{ minWidth: compact ? 0 : 36, justifyContent: 'center', fontSize: 20 }}>
          <span aria-hidden="true">{item.icon}</span>
        </ListItemIcon>
        {!compact && <ListItemText primary={item.label} />}
      </ListItemButton>
    </Tooltip>
  );
}

export function AppLayout({ children, mode, toggleMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const canManageRbac = (user?.roles ?? []).some((role) => ['ADMIN', 'SUPER_ADMIN'].includes(role));
  const items = navigation.filter((item) => !item.restricted || canManageRbac);
  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn: getHealthStatus,
    refetchInterval: 60_000
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = (compact) =>
    items.map((item) => (
      <NavButton
        key={item.to}
        item={item}
        compact={compact}
        selected={location.pathname === item.to}
        onClick={() => setDrawerOpen(false)}
      />
    ));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        backgroundImage:
          'radial-gradient(circle at top right, rgba(25,118,210,.10), transparent 32rem)'
      }}
    >
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backdropFilter: 'blur(14px)',
          bgcolor: 'rgba(255,255,255,.82)'
        }}
      >
        <Toolbar sx={{ gap: { xs: 0.5, sm: 1 }, minHeight: { xs: 64, sm: 72 } }}>
          <Tooltip title="Open navigation" arrow>
            <IconButton
              aria-label="Open navigation"
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { md: 'none' } }}
            >
              <span aria-hidden="true">☰</span>
            </IconButton>
          </Tooltip>
          <Typography
            component="h1"
            variant="h6"
            sx={{ fontWeight: 800, letterSpacing: '-.02em', flexGrow: 1, whiteSpace: 'nowrap' }}
          >
            Secure<span style={{ color: '#1976d2' }}>Portal</span>
          </Typography>
          <Stack direction="row" spacing={{ xs: 0, sm: 0.5 }} alignItems="center">
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.25 }}>{navItems(true)}</Box>
            <Tooltip
              title={mode === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              arrow
            >
              <IconButton aria-label="Toggle colour theme" onClick={toggleMode}>
                <span aria-hidden="true">{mode === 'light' ? '◐' : '☀'}</span>
              </IconButton>
            </Tooltip>
            <Tooltip title="Sign out" arrow>
              <IconButton aria-label="Sign out" color="primary" onClick={handleLogout}>
                <span aria-hidden="true">↪</span>
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 280, p: 1.5 } }}
      >
        <Typography variant="h6" sx={{ px: 1.5, py: 1.25, fontWeight: 800 }}>
          SecurePortal
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <List disablePadding>{navItems(false)}</List>
      </Drawer>

      <Box
        component="main"
        sx={{
          width: '100%',
          maxWidth: 1280,
          mx: 'auto',
          px: { xs: 2, sm: 3, lg: 5 },
          py: { xs: 3, sm: 4, lg: 5 }
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ mb: { xs: 3, sm: 4 } }}
        >
          <Stack spacing={0.25}>
            <Typography
              variant="h4"
              sx={{ fontSize: { xs: '1.7rem', sm: '2rem', lg: '2.25rem' }, fontWeight: 800 }}
            >
              Welcome back
            </Typography>
            <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
              {user?.email ?? 'Authenticated user'}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            color="text.secondary"
            typography="body2"
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: health?.status === 'ok' ? 'success.main' : 'warning.main'
              }}
            />
            <span>{health?.status === 'ok' ? 'System online' : 'Checking system'}</span>
          </Stack>
        </Stack>
        {children}
      </Box>
    </Box>
  );
}
