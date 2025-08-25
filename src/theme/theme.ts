import { createTheme } from '@mui/material/styles';

// Matching the desktop app's dark theme
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffd700', // Gold - Diablo inspired
      light: '#ffed4e',
      dark: '#b8860b',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ff6b6b', // Red accent for important elements
      light: '#ff9494',
      dark: '#c44343',
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#ef5350',
      dark: '#d32f2f',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: '"Exocet Heavy", "Roboto", sans-serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#ffd700',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
    },
    h2: {
      fontFamily: '"Exocet Heavy", "Roboto", sans-serif',
      fontWeight: 700,
      fontSize: '2rem',
      color: '#ffd700',
      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
    },
    h3: {
      fontFamily: '"Exocet Heavy", "Roboto", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#ffd700',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#ffffff',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem',
      color: '#ffffff',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      color: '#ffffff',
    },
    body1: {
      fontSize: '1rem',
      color: '#ffffff',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#b3b3b3',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          borderBottom: '2px solid #ffd700',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1d1d1d',
          border: '1px solid #333',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#ffd700',
          color: '#000000',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: '#ffed4e',
            boxShadow: '0 4px 8px rgba(255,215,0,0.4)',
          },
        },
        outlined: {
          borderColor: '#ffd700',
          color: '#ffd700',
          '&:hover': {
            borderColor: '#ffed4e',
            backgroundColor: 'rgba(255,215,0,0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#333',
          color: '#ffffff',
          '&.achievement-common': {
            backgroundColor: '#4caf50',
            color: '#ffffff',
          },
          '&.achievement-rare': {
            backgroundColor: '#2196f3',
            color: '#ffffff',
          },
          '&.achievement-epic': {
            backgroundColor: '#9c27b0',
            color: '#ffffff',
          },
          '&.achievement-legendary': {
            backgroundColor: '#ff9800',
            color: '#000000',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: '#333',
          borderRadius: 4,
        },
        bar: {
          backgroundColor: '#ffd700',
          borderRadius: 4,
        },
      },
    },
  },
});

export default theme;