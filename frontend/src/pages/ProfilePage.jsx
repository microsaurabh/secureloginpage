import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';

export function ProfilePage() {
  const { user, changePassword, error, clearError } = useAuth();
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues: { currentPassword: '', password: '', confirmPassword: '' } });

  const password = watch('password');

  const onSubmit = async (values) => {
    clearError();
    setSuccess(false);
    setFormError(null);
    try {
      await changePassword({ currentPassword: values.currentPassword, password: values.password });
      setSuccess(true);
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h5">Profile</Typography>
            <Typography color="text.secondary">{user?.email ?? 'Authenticated user'}</Typography>
          </Stack>
          {(error || formError) && <Alert severity="error">{error ?? formError}</Alert>}
          {success && <Alert severity="success">Password updated successfully.</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField label="Current password" type="password" fullWidth {...register('currentPassword', { required: 'Current password is required' })} error={Boolean(errors.currentPassword)} helperText={errors.currentPassword?.message} />
              <TextField label="New password" type="password" fullWidth {...register('password', { required: 'New password is required', minLength: { value: 8, message: 'At least 8 characters' } })} error={Boolean(errors.password)} helperText={errors.password?.message} />
              <TextField label="Confirm password" type="password" fullWidth {...register('confirmPassword', { required: 'Please confirm your password', validate: (value) => value === password || 'Passwords do not match' })} error={Boolean(errors.confirmPassword)} helperText={errors.confirmPassword?.message} />
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Updating…' : 'Update password'}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
