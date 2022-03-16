import Navbar from "./navbar";
import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>Diarization</title>
        <link rel="icon" type="image/x-icon" href="/polyu.ico" />
      </Head>

      <Navbar />
      <main>{children}</main>
    </div>
  )
}
