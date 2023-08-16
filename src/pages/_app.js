import Head from 'next/head';
import Script from 'next/script'

import 'src/styles/bootstrap.css';
import 'src/styles/theme.css';
import 'src/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>DavidASix</title>
        <meta name="description" content="The portfolio and online presence of David A Six." />

      </Head>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous" />
      <Component {...pageProps} />
    </>
  );
}
