import Head from 'next/head';
import React from 'react'

import Arrow from "public/vectors/arrow.svg";

import NavigationLayout from 'src/components/NavigationLayout/';

const Bento = ({size, containerClass, np, ar1, children, zIndex}) => {
  // np = no padding
  const padding = np ? 'p-0' : 'p-2';
  // ar = aspect ratio
  // a size of 2 is the lowest col that is used in the bento.
  // Thus 2 is a square
  const ar =  ar1 ? 'ratio ratio-1x1 align-content-center' : '';
  return (
    <div 
      className={`${size} ${padding} d-flex`} 
      style={{
        minHeight: 150,
        zIndex: zIndex || 50
      }}>
      <div className={`${ar} flex-grow-1 frosted rounded-4 position-relative row  justify-content-center align-items-center ${padding} ${containerClass}`}>
        {children}
      </div>
    </div>
  );
}

export default function MobileApps() {
  return (
    <>
      <Head>
        <title>{`Mobile Apps | DavidASix`}</title>
      </Head>
      <NavigationLayout>
        <section className={`nav-padding col-12 row justify-content-center align-items-start`}>
          <div className={`col-10 col-lg-8 row justify-content-center`} style={{zIndex: 30}}>
            <h1 className={`fs-d1 text-center text-nowrap`}>
              Mobile Apps
            </h1>
            <p className={`text-center`}>
              I have been developing mobile apps with React Native since 2017. While I've occasionally taken breaks to pursue other softwares, I've always considered myself a "Mobile App Developer". <br />
              I've worked on a variety of full-stack applications, taking them from the conceptual phase all the way through launch and maintenance.
            </p>
          </div>
        </section>


        <section 
          id='apps'
          className={`col-12 row justify-content-center align-items-start`}>
          <div 
            style={{zIndex: 20}}
            className={`col-12 col-lg-10 col-xl-9 col-xxl-8 row justify-content-start align-items-start align-content-start`}>

                <Bento size='col-12 col-md-6' containerClass='align-content-center'>
                  <img
                    src='/images/react-icon.png'
                    className='col-3'
                    aria-label='React Native'
                    alt='React Native' />
                  <div className='col-9 row'>
                    <h2 className='fs-5 m-0'>
                      Why write your code twice?
                    </h2>
                    <span className='fs-small'>
                      Creating apps with React Native allows me to create both iOS and Android apps with a single codebase.
                    </span>
                  </div>
                </Bento>
                <Bento 
                  size='col-3 col-md-2' 
                  containerClass='p-0 frosted-0 align-content-start' 
                  zIndex={10}>
                  <h2 className='fs-3 m-0 p-0 mt-2' style={{zIndex: 20}}>
                    My Apps
                  </h2>
                  <Arrow 
                    style={{
                      fill: 'var(--dark)',
                      stroke: 'var(--light)',
                      strokeWidth: 2,
                      position: 'absolute',
                      bottom: '0%',
                      right: '-15%',
                      width: '100%', 
                      height: 'auto', 
                      transform: 'scale(1.65)',
                      transformOrigin: 'right center',
                      zIndex: 10}} />
                </Bento>
                
                <img
                  src='/images/nodejs.png'
                  className='col-3 col-md-2'
                  aria-label='NodeJS' 
                  alt='NodeJS' />
                <img
                  src='/images/python.png'
                  className='col-3 col-md-2'
                  aria-label='Python' 
                  alt='Python'  />
                <img
                  src='/images/python.png'
                  className='col-3 col-md-2'
                  aria-label='Python' 
                  alt='Python'  />
              
            </div>
        </section>
      </NavigationLayout>
    </>
  );
}
