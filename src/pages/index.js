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
    <a 
      href={social.url} 
      className={`rounded-4 mx-2 hover hover-primary  row frosted justify-content-center align-items-center`}>
      <SocialIcon social={social.socialMedia} className='hover' style={{height: 70, width: 70 }} />
    </a>
  );
}

export default function Home(props) {
  return (
    <>
      <Head>
        <title>{`${constants.siteName}`}</title>
      </Head>
      <NavigationLayout>
        <section className={`col-12 row flex-md-row-reverse 
        position-relative 
        justify-content-center align-items-center align-content-center        
        nav-padding ${s.hero}`}>
          <img 
            src='/images/shapes/gradient-bg.png' 
            alt='A gradient background'
            className={s.gradient} />

          <div className={`col-12 col-md-6 row justify-content-center position-relative m-0 px-3`}>
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

          <div className={`col-12 col-md-6 position-relative row justify-content-center align-items-center align-content-center ps-5`}>
            <div className={`row rounded-5 frosted p-2`} style={{zIndex: 20, maxWidth: 700 }}>
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
                Need a developer or data expert with proven soft and hard skills? Look no further!
              </span>
            </div>
          </div>

        </section>
      </NavigationLayout>
    </>
  );
}
