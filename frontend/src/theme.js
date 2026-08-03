import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#6c4ed9' },
    background: { default: '#f5f7fb', paper: '#ffffff' }
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: { fontWeight: 700, textTransform: 'none' }
  },
  components: {
    MuiCard: { styleOverrides: { root: { boxShadow: '0 8px 28px rgba(25, 50, 88, .08)' } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } }
  }
});
