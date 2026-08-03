import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuth();
  const [formError, setFormError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onSubmit = async (values) => {
    clearError();
    setFormError(null);
    try {
      await login(values);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <Box sx={{ display: 'grid', minHeight: '100vh', placeItems: 'center', p: 3 }}>
      <Paper elevation={2} sx={{ maxWidth: 460, p: 4, width: '100%' }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4">Sign in</Typography>
            <Typography color="text.secondary">
              Access the Secure Login Portal dashboard securely.
            </Typography>
          </Stack>
          {(error || formError) && <Alert severity="error">{error ?? formError}</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                autoFocus
                {...register('email', { required: 'Email is required' })}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                {...register('password', { required: 'Password is required' })}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </Stack>
          </Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button component={RouterLink} to="/forgot-password">
              Forgot password?
            </Button>
            <Button component={RouterLink} to="/register">
              Create account
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
