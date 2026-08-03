import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, error, clearError } = useAuth();
  const [formError, setFormError] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }
  });

  const password = watch('password');

  const onSubmit = async (values) => {
    clearError();
    setFormError(null);
    try {
      await registerUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password
      });
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <Box sx={{ display: 'grid', minHeight: '100vh', placeItems: 'center', p: 3 }}>
      <Paper elevation={2} sx={{ maxWidth: 520, p: 4, width: '100%' }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4">Create account</Typography>
            <Typography color="text.secondary">Set up your Secure Login Portal account.</Typography>
          </Stack>
          {(error || formError) && <Alert severity="error">{error ?? formError}</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="First name"
                  fullWidth
                  {...register('firstName', { required: 'First name is required' })}
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName?.message}
                />
                <TextField
                  label="Last name"
                  fullWidth
                  {...register('lastName', { required: 'Last name is required' })}
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName?.message}
                />
              </Stack>
              <TextField
                label="Email"
                type="email"
                fullWidth
                {...register('email', { required: 'Email is required' })}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'At least 8 characters' }
                })}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
              <TextField
                label="Confirm password"
                type="password"
                fullWidth
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match'
                })}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword?.message}
              />
              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account…' : 'Create account'}
              </Button>
            </Stack>
          </Box>
          <Button component={RouterLink} to="/login">
            Back to sign in
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
