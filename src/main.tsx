declare module '@mui/material/styles' {
  interface Palette {
    inactive: import('@mui/material/styles').Palette;
  }
  interface PaletteOptions {
    inactive: import('@mui/material/styles').PaletteColorOptions;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    inactive: true;
  }
}

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { setupWorker, rest, context, response } from 'msw';
import App from './App';
import store from './store/index';

export function res(...transformers: any[]) {
  return response(...transformers, context.delay(5000));
}

const handlers = [
  rest.get(
    'https://api.beesmart.stevenhansel.com/dashboard/v1/announcements',
    (_req, _, ctx) => {
      return res(
        ctx.json({
          count: 0,
          totalPages: 0,
          hasNext: false,
          contents: [],
        })
      );
    }
  ),
];

const worker = setupWorker(...handlers);

worker.start();

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider
        theme={createTheme({
          palette: {
            secondary: {
              main: '#f29115',
              contrastText: '#ffffff',
            },
            inactive: {
              light: '#f5f5f5',
              main: '#c4c4c4',
              contrastText: '#a0a4a8',
            },
          },
        })}
      >
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </LocalizationProvider>
  </React.StrictMode>
);
