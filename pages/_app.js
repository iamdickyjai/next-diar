import React from 'react';
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically 

import Layout from '../components/layout'
import '../styles/globals.css'
import { ThemeContext, DataContext, reducers } from '../components/reducer';
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
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: '#ffc83d',
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: '#ffc83d',
            }
          }
        }
      }
    }
  })

  const reducer = React.useReducer(reducers, { file: null, timestamp: null, application: null, link: null });

  const [MainTheme, setTheme] = React.useState('dark');

  return (
    <ThemeContext.Provider value={{ theme: MainTheme, setTheme }}>
      <ThemeProvider theme={theme}>
        <DataContext.Provider value={reducer}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </DataContext.Provider>
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}


{/* <style jsx global>{`
body {
  background-color:gray;
  color: white;
  height: 100vh;
}
`}</style> */}