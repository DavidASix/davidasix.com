import Head from 'next/head';
import Script from 'next/script'

import c from '@/assets/constants';
import '@/styles/globals.css'


export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{`${c.siteName}`}</title>
        <meta name="description"        content="" />
        <meta name="description"        content="" />
        <meta property="og:image"       content="" />
        <meta property="og:site_name"   content="" />
        <meta property="og:title"       content="" />
        <meta property="og:description" content="" />
        
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.cdnfonts.com/css/satoshi" rel="stylesheet" />
      </Head>
      
      <Script defer data-domain={c.plausible_domain} src="https://plausible.io/js/script.tagged-events.js"></Script>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${c.google_tag}`}
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${c.google_tag}');
        `}
      </Script>

      <Component {...pageProps} />
    </>
  );
}
