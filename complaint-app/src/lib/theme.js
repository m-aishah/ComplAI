import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1D3557',
    },
    secondary: {
      main: '#F1FAEE',
    },
    background: {
      default: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

export default theme;