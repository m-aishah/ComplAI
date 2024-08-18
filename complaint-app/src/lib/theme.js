'use client'
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: '#0A2540', // Dark blue
    },
    secondary: {
      main: '#FFCD00', // Yellow
    },
    background: {
      default: '#F5F7FA',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif", // Use the Inter font
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontSize: '1rem',
        },
      },
    },
  },
});

export default theme;
