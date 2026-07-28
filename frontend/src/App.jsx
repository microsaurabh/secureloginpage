import { useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { ResetPasswordPage } from './pages/ResetPasswordPage.jsx';
import { UsersPage } from './pages/UsersPage.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { theme as baseTheme } from './theme.js';

function AppShell() {
  const [mode, setMode] = useState('light');
  const { isAuthenticated } = useAuth();
  const paletteMode = mode === 'light' ? 'light' : 'dark';
  const theme = useMemo(
    () =>
      createTheme({
        ...baseTheme,
        palette: { ...baseTheme.palette, mode: paletteMode, background: { default: paletteMode === 'light' ? '#f6f8fb' : '#121212' } }
      }),
    [paletteMode]
  );

  const toggleMode = () => setMode((current) => (current === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
          <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />} />
          <Route path="/reset-password" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ResetPasswordPage />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <AppLayout mode={mode} toggleMode={toggleMode}>
                  <DashboardPage />
                </AppLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <AppLayout mode={mode} toggleMode={toggleMode}>
                  <ProfilePage />
                </AppLayout>
              }
            />
            <Route
              path="/users"
              element={
                <AppLayout mode={mode} toggleMode={toggleMode}>
                  <UsersPage />
                </AppLayout>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </QueryClientProvider>
  );
}
