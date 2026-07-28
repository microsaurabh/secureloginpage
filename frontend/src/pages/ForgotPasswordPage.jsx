import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ForgotPasswordPage() {
  const { requestReset, error, clearError } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async (values) => {
    clearError();
    setFormError(null);
    try {
      await requestReset(values.email);
      setSubmitted(true);
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <Box sx={{ display: 'grid', minHeight: '100vh', placeItems: 'center', p: 3 }}>
      <Paper elevation={2} sx={{ maxWidth: 480, p: 4, width: '100%' }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4">Reset password</Typography>
            <Typography color="text.secondary">Enter the email associated with your account.</Typography>
          </Stack>
          {(error || formError) && <Alert severity="error">{error ?? formError}</Alert>}
          {submitted && <Alert severity="success">If the account exists, reset instructions have been sent.</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField label="Email" type="email" fullWidth {...register('email', { required: 'Email is required' })} error={Boolean(errors.email)} helperText={errors.email?.message} />
              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : 'Send reset link'}
              </Button>
            </Stack>
          </Box>
          <Button component={RouterLink} to="/login">Back to sign in</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
