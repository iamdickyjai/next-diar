import React from 'react';
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically 

import Layout from '../components/layout'
import '../styles/globals.css'
import { DataContext, reducers } from '../components/reducer';

export default function MyApp({ Component, pageProps }) {


  const reducer = React.useReducer(reducers, { file: null, timestamp: null, application: null, link: null });

  return (
    <DataContext.Provider value={reducer}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </DataContext.Provider>
  )
}
