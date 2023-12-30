import Head from 'next/head';

import s from "src/pages/home.module.css";
import cs from "src/styles/common.module.css";

import constants from 'src/assets/constants';

import NavigationLayout from 'src/components/NavigationLayout/';
import SocialIcon from 'src/components/SocialIcon/';
import Circles from "public/images/shapes/circle-scatter.svg";

const socials = require('/src/assets/socials.json');

const SocialLink = ({social}) => {
  return (
    <div className='p-1'>
      <a 
        href={social.url} 
        target='_blank' 
        rel='noopener noreferrer'
        className={`rounded-4 hover hover-secondary frosted row justify-content-center align-items-center`}>
        <SocialIcon 
          social={social.socialMedia} 
          className='p-2 hover hover-secondary grow'
          style={{height: 60, width: 70 }} />
      </a>
    </div>
  );
}

const Bento = ({size, containerClass, np, children}) => {
  // np = no padding
  const padding = np ? 'p-0' : 'p-2';
  return (
    <div className={`col-${size} ${padding}`}>
      <div className={`h-100 w-100 frosted rounded-4 row justify-content-center align-items-center ${padding} ${containerClass}`}>
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
            <div className={`row rounded-5 frosted-0 frosted-md p-2`} style={{zIndex: 20, maxWidth: 700 }}>
              <span className={`fs-3 fw-lighter headerFont`}>
                Hi there, I’m
              </span>
              <h1 className={`fs-d5 headerFont`}>David A Six</h1>
              <span className='mt-2'>
                I’m a developer, maker, and tech enthusiast.
              </span>
              <span className='mt-2'>
                Why the six? I’m the sixth David Anderson in my family tree!
              </span>
              <span className='my-2'>
                Need a developer or data expert with proven soft and hard skills? Here I am!
              </span>
            </div>
          </div>
        </section>
        <section
          id='bento'
          className={`col-12 row justify-content-center`}>
          <div 
            className={`col-12 col-lg-10 row justify-content-center align-items-center align-content-center`}>
              <h1 className='fs-d5 col-12 p-0'>
                A little about me
              </h1>
              <div className='col-12 row'>
                <Bento size={3}>
                  <span className='border'>text</span>
                </Bento>
                <Bento size={6}>
                  <span>text</span>
                </Bento>
                <Bento size={3} containerClass='bg-primary'>
                  <span>text</span>
                </Bento>
              </div>
              
              <div className='col-12 row'>
                <Bento size={2}>
                  <span>text</span>
                </Bento>
                <Bento size={4} containerClass='frosted-0'>
                  <span>text</span>
                </Bento>
                <Bento size={6} containerClass='bg-primary'>
                  <span>text</span>
                </Bento>
              </div>

              <div className='col-12 row'>
                <Bento size={4} containerClass='bg-primary'>
                  <span>text</span>
                </Bento>
                <Bento size={8} np containerClass='frosted-0'>
                  <Bento size={12}>
                    <span>text</span>
                  </Bento>
                  <Bento size={12}>
                    <span>text</span>
                  </Bento>
                </Bento>
              </div>
            </div>
          </section>
          
          <section
            id='work'
            className={`col-12 row justify-content-center`}>
            <div 
              className={`col-12 col-lg-10 row justify-content-center align-items-center align-content-center`}>
                <h1 className='fs-d5 col-12 p-0'>
                  My recent work
                </h1>
              </div>
            </section>
          
      </NavigationLayout>
    </>
  );
}
