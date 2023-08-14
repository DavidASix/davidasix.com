import Head from 'next/head';
import 'src/styles/theme.css';
import 'src/styles/globals.css';
import 'src/styles/bootstrap.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>DavidASix</title>
        <meta name="description" content="The portfolio and online presence of David A Six." />

        <script async src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossOrigin="anonymous"></script>
        <script async src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js" integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" crossOrigin="anonymous"></script>
        
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand&family=Major+Mono+Display&display=swap" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/baron-neue" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
