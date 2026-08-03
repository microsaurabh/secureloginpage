import { Box, Button, Chip, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const capabilities = ['Registration', 'Login', 'Refresh rotation', 'Password reset'];

export function HomePage() {
  return (
    <Box
      component="main"
      sx={{
        display: 'grid',
        minHeight: '100vh',
        placeItems: 'center',
        px: { xs: 2, sm: 4 },
        py: { xs: 3, md: 6 },
        background: 'linear-gradient(135deg, #f7fbff 0%, #eef3ff 100%)'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 760,
          p: { xs: 3, sm: 5, md: 7 },
          width: '100%',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Stack spacing={{ xs: 2.5, sm: 3 }}>
          <Chip
            label="Enterprise authentication"
            color="primary"
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          />
          <Typography
            component="h1"
            variant="h3"
            sx={{ fontSize: { xs: '2.25rem', sm: '3.25rem' }, fontWeight: 800, lineHeight: 1.08 }}
          >
            Secure Login Portal
          </Typography>
          <Typography color="text.secondary" variant="body1">
            A production-oriented authentication platform with versioned APIs, secure sessions, and
            role-aware access controls.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {capabilities.map((capability) => (
              <Chip key={capability} label={capability} color="primary" variant="outlined" />
            ))}
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Tooltip title="Create a new account" arrow>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                startIcon={<span aria-hidden="true">＋</span>}
              >
                Create account
              </Button>
            </Tooltip>
            <Tooltip title="Sign in to your account" arrow>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                startIcon={<span aria-hidden="true">→</span>}
              >
                Sign in
              </Button>
            </Tooltip>
          </Stack>
          <Typography color="text.secondary" variant="body2">
            Use the API at /api/v1 or the OpenAPI documentation at /api-docs to explore the
            available authentication flows.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
