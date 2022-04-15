import React from 'react';
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically 

import Layout from '../components/layout'
import '../styles/globals.css'
import { DataContext, reducers } from '../components/reducer';
import { createTheme, ThemeProvider } from '@mui/material';

export default function MyApp({ Component, pageProps }) {
  const theme = createTheme({
    components: {
      MuiSelect: {
        styleOverrides: {
          root: {
            width: '160px',
            color: '#564d3f',
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: '#564d3f',
            },
          },

        }
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            color: '#564d3f',
            fontSize: '1rem',
            fontStyle: 'italic',
          }
        }
      }
    }
  })

  const reducer = React.useReducer(reducers, { file: null, timestamp: null, application: null, link: null });

  return (
    <ThemeProvider theme={theme}>
      <DataContext.Provider value={reducer}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </DataContext.Provider>
    </ThemeProvider>
  )
}
