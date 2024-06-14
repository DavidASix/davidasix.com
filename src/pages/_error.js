import Head from 'next/head';
import React from 'react'

import c from '@/assets/constants'
import NavigationLayout from '@/components/NavigationLayout';

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default function Error({ statusCode }) {
  const code = statusCode || "Oops, an error occured";
  const messages = {
    400: "Something went wrong",
    401: "Unauthorized",
    402: "Payment required",
    403: "Forbidden",
    404: "Page not found",
    429: "You're browsing at lightspeed!",
    500: "Something went wrong",
    502: "We could not find that resource",
  };

  return (
    <>
      <Head>
        <title>DavidASix | 404</title>
      </Head>
      <NavigationLayout>
        <section
          id="404"
          className={`${c.sectionPadding} min-h-[70vh] grid grid-cols-2 content-start md:content-normal`}
        >
          <div className="order-2 md:order-1 col-span-2 md:col-span-1 py-8 px-4 flex flex-col justify-center items-center h-full">
            <h1 className="header-font text-6xl md:text-7xl font-extrabold">{statusCode}</h1>
            <span className="text-3xl md:text-2xl">{messages[code] || "Something went wrong, sorry!"}</span>
            <p className="mt-3 text-center">
              I don't think this is what you were looking for! <br />
              Try going <a href="/" className="underline">back to our home page</a>
            </p>
          </div>
          <div className="order-3 md:order-2 col-span-2 md:col-span-1 px-4 flex flex-col justify-center items-center h-full">
          </div>
        </section>
      </NavigationLayout>
    </>
  );
}
