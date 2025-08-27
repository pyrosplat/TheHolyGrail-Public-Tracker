import { createTheme } from '@mui/material/styles';

type PaletteMode = 'light' | 'dark';

// Extend the theme to include custom typography variants
declare module '@mui/material/styles' {
  interface TypographyVariants {
    diablo: React.CSSProperties;
    runes: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    diablo?: React.CSSProperties;
    runes?: React.CSSProperties;
  }
}

// Create theme based on mode
export const createAppTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#CC5F43', // Orange - matching progress bars
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: mode === 'dark' ? '#000000' : '#000000',
    },
    secondary: {
      main: '#ff6b6b', // Red accent for important elements
      light: '#ff9494',
      dark: '#c44343',
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#f5f5f5',
      paper: mode === 'dark' ? '#1d1d1d' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#212121',
      secondary: mode === 'dark' ? '#b3b3b3' : '#757575',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#CC5F43',
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
      fontFamily: '"Exocet Heavy", "D2Runes", "Roboto", sans-serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      color: mode === 'dark' ? '#CC5F43' : '#000000',
      textShadow: mode === 'dark' ? '2px 2px 4px rgba(0,0,0,0.8)' : '1px 1px 2px rgba(0,0,0,0.3)',
      letterSpacing: '0.02em',
    },
    h2: {
      fontFamily: '"Exocet Heavy", "D2Runes", "Roboto", sans-serif',
      fontWeight: 700,
      fontSize: '2rem',
      color: mode === 'dark' ? '#CC5F43' : '#000000',
      textShadow: mode === 'dark' ? '1px 1px 2px rgba(0,0,0,0.8)' : '1px 1px 1px rgba(0,0,0,0.3)',
      letterSpacing: '0.02em',
    },
    h3: {
      fontFamily: '"Exocet Heavy", "D2Runes", "Roboto", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      color: mode === 'dark' ? '#CC5F43' : '#000000',
      letterSpacing: '0.02em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: mode === 'dark' ? '#ffffff' : '#212121',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem',
      color: mode === 'dark' ? '#ffffff' : '#212121',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      color: mode === 'dark' ? '#ffffff' : '#212121',
    },
    body1: {
      fontSize: '1rem',
      color: mode === 'dark' ? '#ffffff' : '#212121',
    },
    body2: {
      fontSize: '0.875rem',
      color: mode === 'dark' ? '#b3b3b3' : '#757575',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
    // Custom typography variants to match desktop app
    diablo: {
      fontFamily: '"Exocet Heavy", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif',
      fontWeight: 700,
      letterSpacing: '0.02em',
      color: mode === 'dark' ? '#CC5F43' : '#000000',
      textShadow: mode === 'dark' ? '1px 1px 2px rgba(0,0,0,0.8)' : '1px 1px 1px rgba(0,0,0,0.3)',
    },
    runes: {
      fontFamily: '"D2Runes", "Exocet Heavy", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif',
      fontWeight: 'normal',
      letterSpacing: '0.02em',
      color: mode === 'dark' ? '#CC5F43' : '#000000',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
          borderBottom: '2px solid #CC5F43',
          color: mode === 'dark' ? '#ffffff' : '#212121',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#1d1d1d' : '#ffffff',
          border: mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
          borderRadius: 8,
          boxShadow: mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.6)' : '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: mode === 'dark' ? '#CC5F43' : '#000000',
          color: mode === 'dark' ? '#000000' : '#ffffff',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: mode === 'dark' ? '#ffb74d' : '#333333',
            boxShadow: mode === 'dark' ? '0 4px 8px rgba(255,152,0,0.4)' : '0 4px 8px rgba(0,0,0,0.4)',
          },
        },
        outlined: {
          borderColor: mode === 'dark' ? '#CC5F43' : '#000000',
          color: mode === 'dark' ? '#CC5F43' : '#000000',
          '&:hover': {
            borderColor: mode === 'dark' ? '#ffb74d' : '#333333',
            backgroundColor: mode === 'dark' ? 'rgba(255,152,0,0.1)' : 'rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#333' : '#e0e0e0',
          color: mode === 'dark' ? '#ffffff' : '#212121',
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
            backgroundColor: mode === 'dark' ? '#CC5F43' : '#000000',
            color: mode === 'dark' ? '#000000' : '#ffffff',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#333' : '#e0e0e0',
          borderRadius: 4,
        },
        bar: {
          backgroundColor: mode === 'dark' ? '#CC5F43' : '#000000',
          borderRadius: 4,
        },
      },
    },
  },
});

// Default to dark theme to match desktop app
export const theme = createAppTheme('dark');
export default createAppTheme;