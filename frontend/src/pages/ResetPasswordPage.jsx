import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { reset, error, clearError } = useAuth();
  const [formError, setFormError] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues: { password: '', confirmPassword: '' } });

  const password = watch('password');

  const onSubmit = async (values) => {
    clearError();
    setFormError(null);
    try {
      await reset({ token: searchParams.get('token') ?? '', password: values.password });
      navigate('/login');
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <Box sx={{ display: 'grid', minHeight: '100vh', placeItems: 'center', p: 3 }}>
      <Paper elevation={2} sx={{ maxWidth: 480, p: 4, width: '100%' }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4">Set new password</Typography>
            <Typography color="text.secondary">Choose a strong password for your account.</Typography>
          </Stack>
          {(error || formError) && <Alert severity="error">{error ?? formError}</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField label="New password" type="password" fullWidth {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })} error={Boolean(errors.password)} helperText={errors.password?.message} />
              <TextField label="Confirm password" type="password" fullWidth {...register('confirmPassword', { required: 'Please confirm your password', validate: (value) => value === password || 'Passwords do not match' })} error={Boolean(errors.confirmPassword)} helperText={errors.confirmPassword?.message} />
              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                {isSubmitting ? 'Updating…' : 'Save password'}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
