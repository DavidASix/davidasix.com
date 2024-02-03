import Head from 'next/head';
import Script from 'next/script'

import 'src/styles/bootstrap.css';
import 'src/styles/theme.css';
import 'src/styles/globals.css';
import 'src/styles/blogPost.css';

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
      <Script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" 
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" 
        crossorigin="anonymous"
        onLoad={() => {
          // After bootstrap script is loaded, we set up the dynamic elements, depending on what is on each page.
          // This is done here as due to SSR each page might not have access to document, or bootstrap. 
          // Performing these functions here ensures that bootstrap class is available
          const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
          if (!tooltips.length) { return; }
          tooltips.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        }}/>
      <Component {...pageProps} />
    </>
  );
}
