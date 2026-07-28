import { Box, Button, Paper, Stack, Typography } from '@mui/material';

export function HomePage() {
  return (
    <Box component="main" sx={{ display: 'grid', minHeight: '100vh', placeItems: 'center', p: 3 }}>
      <Paper elevation={2} sx={{ maxWidth: 560, p: 5, width: '100%' }}>
        <Stack spacing={2}>
          <Typography component="h1" variant="h3">
            Secure Login Portal
          </Typography>
          <Typography color="text.secondary">
            The authentication platform foundation is ready. Sign-in and account-management features
            will be introduced in a future increment.
          </Typography>
          <Button disabled variant="contained">
            Sign in (coming soon)
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
