import React, { useEffect, useLayoutEffect } from 'react';
import Head from 'next/head';

import s from "src/pages/home.module.css";
import cs from "src/styles/common.module.css";

import constants from 'src/assets/constants';

import NavigationLayout from 'src/components/NavigationLayout/';
import SocialIcon from 'src/components/SocialIcon/';
import Python from "public/vectors/python.svg";
import Node from "public/vectors/node.svg";
import SQL from "public/vectors/sql.svg";

const socials = require('/src/assets/socials.json');

const SocialLink = ({social}) => {
  return (
    <div className='p-1'>
      <a 
        href={social.url} 
        target='_blank' 
        rel='noopener noreferrer'
        className={`rounded-4 hover hover-danger frosted row justify-content-center align-items-center`}>
        <SocialIcon 
          social={social.socialMedia} 
          className='p-2 hover hover-danger'
          style={{height: 60, width: 70 }} />
      </a>
    </div>
  );
}


const Bento = ({size, containerClass, np, children, id}) => {
  const useWindowSize = () => {
    const [size, setSize] = React.useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }
  const [width, height] = useWindowSize();
  
  useEffect(() => {
    const bentoPrime = document.getElementById('bento-prime');
    if (bentoPrime) {
      const width = bentoPrime.offsetWidth;
      // Loop through the possible heights of 1 - 5 row height.
      for (let i = 1; i <= 5; i++) {
        const bentoGridItems = document.getElementsByClassName(`bento-rh-${i}`);
        for (let j = 0; j < bentoGridItems.length; j++) {
          bentoGridItems[j].style.height = `${width * i}px`;
        }
      }
    }
  }, [width, height]);
  
  // np = no padding
  const padding = np ? 'p-0' : 'p-1';
  return (
    <div
      id={id ? id : undefined}
      className={`${size} ${padding} d-flex bento-rh-1`} style={{minHeight: 150}}>
      <div className={`flex-grow-1 frosted rounded-4 row align-content-center justify-content-center align-items-center ${padding} ${containerClass}`}>
        {children}
      </div>
    </div>
  );
}

export default function Home(props) {
  
  return (
    <>
      <Head>
        <title>{`${constants.siteName}`}</title>
      </Head>
      <NavigationLayout>
        <section 
          id='hero'
          className={`col-12 row flex-md-row-reverse 
        position-relative 
        justify-content-center align-items-center align-content-center        
        nav-padding ${s.hero}`}>
          <img 
            src='/images/shapes/gradient-bg.png' 
            alt='A gradient background'
            className={s.gradient} />

          <div className={`col-12 col-md-6 row justify-content-center position-relative m-0 px-3 mb-3 mb-lg-0`}>
            <img
              src="/images/headshot_bg.svg"
              alt="An orange circle behind image of David"
              style={{zIndex: 0, position: 'absolute', bottom: 0}}
              className={`${s.headshot} px-3`}
            />
            <img
              src="/images/headshot.png"
              alt="A headshot of David wearing an unbuttoned white collared shirt."
              style={{zIndex: 15}}
              className={`${s.headshot} px-3`}
            />
            <div className={`${s.socialRow}`} style={{zIndex: 20}}>
              {socials.map((s, i) => <SocialLink key={i} social={s} color='white' />)}
            </div>
          </div>

          <div className={`col-12 col-md-6 position-relative row justify-content-center align-items-center align-content-center px-2 ps-lg-5`}>
            <div className={`row rounded-5 frosted-0 frosted-md p-2 py-5 py-md-2`} style={{zIndex: 20, maxWidth: 700 }}>
              <span className={`fs-3 fw-lighter header-font`}>
                Hi there, I’m
              </span>
              <h1 className={`fs-d5 header-font`}>David A Six</h1>
              <span className='mt-2'>
                I’m a developer, maker, and tech enthusiast. Why the six? I’m the sixth David Anderson in my family tree.
              </span>
              <span className='my-2'>
                Need a developer or data expert with proven soft and hard skills? Here I am!
              </span>
            </div>
          </div>
        </section>
        <section
          id='bento'
          className={`col-12 row justify-content-center position-relative`}>
            
            <img 
              src='/images/shapes/gradient-bg.png' 
              alt='A gradient background'
              style={{zIndex: 10}}
              className={s.gradient} />
          <div 
            style={{zIndex: 20}}
            className={`col-12 col-lg-10 col-xl-9 col-xxl-7 row justify-content-center align-items-center align-content-center`}>
              <h1 className='fs-d5 col-12 p-0'>
                A little about me
              </h1>

              <div className='col-12 row'>
                <Bento size='col-4 col-md-2' id='bento-prime'>
                  <h2 className='row text-center align-content-center'>
                    <span className='fs-d5 p-0'>
                    {new Date().getFullYear() - 2017}
                    </span>
                    <span className='fs-6 fs-md-5 p-0'>Years as a Developer</span>
                  </h2>
                </Bento>
                <Bento size='col-8 col-md-4' containerClass='align-content-center'>
                  <h2 className='fs-5 mt-0 fw-semibold'>
                    I've worked with lots of tech
                  </h2>
                  <span className='fs-small fs-md-6'>
                    But I do most of my coding in these languages
                  </span>
                </Bento>
                <img
                  src='/images/nodejs.png'
                  className='col-4 col-md-2' 
                  style={{objectFit: 'contain'}}
                  aria-label='NodeJS' 
                  alt='NodeJS' />
                <img
                  src='/images/python.png'
                  className='col-4 col-md-2'
                  style={{objectFit: 'contain'}}
                  aria-label='Python' 
                  alt='Python'  />
                <img
                  src='/images/sql.png'
                  className='col-4 col-md-2'
                  style={{objectFit: 'contain'}}
                  aria-label='SQL' 
                  alt='SQL' />
              </div>
              
              <div className='col-12 row'>
                <Bento size='col-8 col-md-4' containerClass=''>
                  <span className='fs-6'>
                    I've worn red shoes for years, and they inspired the name for my webdesign company, <a href='https://redoxfordonline.com' target='_blank' rel='noopener noreferrer' className='hover hover-danger fw-bold'>Red Oxford Online</a>.
                  </span>
                </Bento>
                <img 
                  style={{ height: 'auto', objectFit: 'contain'}}
                  className='col-4 col-md-2 p-1 position-relative'
                  src='/images/low-poly-red-shoes.png' 
                  alt='A pair of red oxford shoes' />
                <Bento size='col-4 col-md-2'>
                  <h2 className='row text-center align-content-center'>
                    <span className='fs-d5 p-0'>5</span>
                    <span className='fs-6 fs-md-5 p-0'>Years in Sales & Business</span>
                  </h2>
                </Bento>
                <Bento size='col-8 col-md-4' containerClass='frosted-primary'>
                  <h2 className='fs-5 fw-semibold mt-0 text-nowrap'>
                    Corporate & Startups
                  </h2>
                  <span className='fs-small fs-md-6'>
                    My varied experience has allowed me to develop excellent communication and leadership skills
                  </span>
                </Bento>
              </div>

              <div className='col-12 row align-items-center'>
                <img 
                  style={{ height: 'auto', objectFit: 'contain'}}
                  className='col-4 col-md-2 bento-rh-2 m-0  d-none d-md-block'
                  src='/images/low-poly-shepherd-1x2.png' 
                  alt='A German Shepherd' />

                <div className='col-12 col-md-10 row align-items-center'>
                  
                <img 
                  style={{ height: 'auto', objectFit: 'contain'}}
                  className='col-4 bento-rh-1 m-0 d-block d-md-none'
                  src='/images/low-poly-shepherd-head.png' 
                  alt='A German Shepherd' />

                  <Bento size='col-8 col-md-3' containerClass='frosted-danger align-content-center'>
                    <span className='text-center fs-5 fw-semibold p-0'>
                      I have a dog
                    </span>
                    <span className='text-center fs-small fs-md-6 p-0'>
                      His name is Zachary. He is very cute.
                    </span>
                  </Bento>
                  <Bento size='col-8 col-md-6'>
                    <span className='fs-6'>
                      I'm a huge fan of <span className='fw-bold'>Cyberpunk.</span> Whether it's books, games, movies or TV, if it's Cyberpunk I'm willing to give it a try.
                    </span>
                  </Bento>
                  <img 
                    style={{maxHeight: 200, objectFit: 'contain'}}
                    className='p-2 p-md-2 m-0 col-4 col-md-3 bento-rh-1'
                    src='/images/electric-sheep.png' 
                    alt='An Electric Sheep' />
                  <Bento size={12}>
                    <span className='fs-6'>
                      I consider myself a lot of things, but first and foremost I am a <span className='fw-bold'>problem solver</span>. When I encounter a new challenge I use my skills in research and analysis to find a creative solution.
                    </span>
                  </Bento>
                </div>
              </div>

            </div>
          </section>
          <section
            id='work'
            className={`col-12 row justify-content-center mt-5`}>
            <div 
              className={`col-12 col-lg-10 row justify-content-center align-items-center align-content-center`}>
                {/* <h1 className='fs-d5 col-12 p-0'>
                  My recent work
                </h1>
              <span>
                https://iconscout.com/free-3d-illustration-pack/coding-lang
              </span> */}
              </div>
            </section>
      </NavigationLayout>
    </>
  );
}
