// theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { typography } from './utils/fonts';

export const themeOptions: ThemeOptions = {
  typography,
  palette: {
    mode: 'light',
    primary: {
      main: '#2e81bd',
      light: '#5599cd',
      dark: '#205a84',
      contrastText: '#fff',
    },
    secondary: {
      main: '#8523a6',
      light: '#9d4fb8',
      dark: '#5d1874',
      contrastText: '#fff',
    },
    error: {
      main: '#d41d1d',
      light: '#dd4949',
      dark: '#941414',
      contrastText: '#fff',
    },
    warning: {
      main: '#f37c1e',
      light: '#f5964a',
      dark: '#aa5715',
      contrastText: '#fff',
    },
    success: {
      main: '#2e7d32',
      light: '#46c850',
      dark: '#118219',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#fff',
          color: 'rgba(0, 0, 0, 0.87)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          color: 'rgba(0, 0, 0, 0.87)',
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);
export default theme;