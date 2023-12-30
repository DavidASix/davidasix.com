import Head from 'next/head';
import Script from 'next/script'

import 'src/styles/bootstrap.css';
import 'src/styles/theme.css';
import 'src/styles/globals.css';

import constants from 'src/assets/constants';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{`${constants.siteName}`}</title>
        <meta name="description"        content="" />
        <meta name="description"        content="" />
        <meta property="og:image"       content="" />
        <meta property="og:site_name"   content="" />
        <meta property="og:title"       content="" />
        <meta property="og:description" content="" />
      </Head>
      {/*<!-- Google tag (gtag.js) -->*/}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-" />
      <Script id="google-analytics">
      {/* Paste analytics here */}
      {`
        
      `}
      </Script>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous" />

      <Component {...pageProps} />
    </>
  );
}
