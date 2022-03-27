import React from 'react';

import Layout from '../components/layout'
import '../styles/globals.css'
import { DataContext, reducers } from '../components/reducer';

export default function MyApp({ Component, pageProps }) {


  const reducer = React.useReducer(reducers, { file: null, timestamp: null, application: null });

  return (
    <DataContext.Provider value={reducer}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </DataContext.Provider>
  )
}
