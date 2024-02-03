import Head from 'next/head';
import React, { useState, useEffect } from "react";

import s from "./contact.module.css";
import constants from 'src/assets/constants';

import NavigationLayout from 'src/components/NavigationLayout/';
import ContactForm from 'src/components/ContactForm';


export default function Contact() {
  //TODO: Add faq fetch from FB
  const [faq, setFaq] = useState([]);
  const [errorInFetch, setErrorInFetch] = useState(false);

  useEffect(() => {
    const initialAsyncLoad = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFaq(baseFaq);
        setErrorInFetch(false);
      } catch (err) {
        setErrorInFetch(true);
      }
    }
    initialAsyncLoad();
  }, []);

  return (
    <>
      <Head>
        <title>{`${constants.titlePrefix} | Contact`}</title>
      </Head>
      <NavigationLayout>

        <section 
          id='overview'
          style={{minHeight: '60vh'}}
          className={`col-12 col-md-11 col-xxl-10 px-lg-2 px-1 d-flex`}>
          <div className={`col-12 row justify-content-center align-items-stretch rounded-5 py-5 px-md-5`}>
            <h1>Contact</h1>
          </div>
        </section>
        
        <section className='col-12 row'>
          <ContactForm>
            <h2 className='mb-3 p-0 headerFont fs-d2 fs-md-d6'>
              Something to say?
            </h2>
            <p className='d-flex flex-column p-0 m-0 '>
              <span className={`my-2`}>
               Please reach out! I'll get back to you as quickly as I can.
              </span>
            </p>
          </ContactForm>
        </section>

      </NavigationLayout>
    </>
  ); 
}
