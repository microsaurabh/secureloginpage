import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const capabilities = ['Registration', 'Login', 'Refresh rotation', 'Password reset'];

export function HomePage() {
  return (
    <Box component="main" sx={{ display: 'grid', minHeight: '100vh', placeItems: 'center', p: 3 }}>
      <Paper elevation={2} sx={{ maxWidth: 640, p: 5, width: '100%' }}>
        <Stack spacing={2.5}>
          <Typography component="h1" variant="h3">
            Secure Login Portal
          </Typography>
          <Typography color="text.secondary" variant="body1">
            A production-oriented authentication platform with versioned APIs, secure sessions,
            and role-aware access controls.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {capabilities.map((capability) => (
              <Chip key={capability} label={capability} color="primary" variant="outlined" />
            ))}
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button component={RouterLink} to="/register" variant="contained">
              Create account
            </Button>
            <Button component={RouterLink} to="/login" variant="outlined">
              Sign in
            </Button>
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
