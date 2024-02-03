import Head from 'next/head';
import React from 'react'

import cs from "src/styles/common.module.css";

import constants from 'src/assets/constants';

import NavigationLayout from 'src/components/NavigationLayout/';

export default function About() {
  return (
    <>
      <Head>
        <title>{`${constants.siteName} | 404`}</title>
      </Head>
      <NavigationLayout>
      <section
          id='404'
          className={`${cs.section} row justify-content-center align-items-center align-content-center`}
          style={{ minHeight: '70vh' }}
        >   
            <div className='col-lg-10 col-12 row justify-content-center'>
                <div className='col-lg-4 col-sm-8 col-12 d-flex flex-column justify-content-center'>
                    <h1 className='display-1 text-start'>
                        404 Error
                    </h1>
                    <span className='h3 text-start m-0'>
                        Page not found
                    </span>
                    <p className='mt-3 text-large-start'>
                        We couldn't find what you're looking for. Try going <a href='/'>back to our home page</a>.
                    </p>
                </div>

                <div
                    style={{maxHeight: '50vh'}}
                    className=' col-lg-6 col-sm-10 col-10 mt-lg-0 mt-5 bg-dark' />
            </div>
        </section>
      </NavigationLayout>
    </>
  );
}
