import Head from 'next/head';
import s from "src/pages/home.module.css";
import cs from "src/styles/common.module.css";
import NavigationLayout from 'src/components/NavigationLayout/';
import SocialIcon from 'src/components/SocialIcon/';

import Circles from "public/images/shapes/circle-scatter.svg";

const SocialLink = ({social}) => {
  return (
    <a 
      href={social.url} 
      className={`rounded-4 mx-2 ${cs.center} ${cs.frosted} ${cs.grow} ${s.socialContainer}`}>
      <SocialIcon social={social.socialMedia} style={{height: "70%", width: "70%", fill: "var(--fg)" }} />
    </a>
  );
}

async function getSocialAccounts() {
  const socialAccounts = [
    {
      socialMedia: 'github',
      url: "https://github.com/DavidASix",
      displayName: "DavidASix"
    },
    {
      socialMedia: 'instagram',
      url: "https://www.instagram.com/dave6dev",
      displayName: "DavidASix"
    },
    {
      socialMedia: 'youtube',
      url: "https://www.youtube.com/channel/@Dave6",
      displayName: "DavidASix"
    },
    {
      socialMedia: 'email',
      url: "mailto:dave6@dave6.ca",
      displayName: "DavidASix"
    },
  ]
  return socialAccounts;
}

export const getServerSideProps = async () => {
  let socials = await getSocialAccounts();
  return { props: { socials } }
}
 
export default function Home({socials}) {
  return (
    <>
      <Head>
      </Head>
      <NavigationLayout>
        <section className={`${cs.center} ${cs.maxSection} ${cs.heroSection} row flex-md-row-reverse px-2`}>
          <div className={`col-12 col-md-6 position-relative flex-column pt-md-0 pt-3 ${cs.center}`} style={{zIndex: 20}}>
            <div className={`${s.headshotContainer}`}>
              <img
                src="/images/headshot_bg.svg"
                alt="An orange circle behind image of David"
                className={`${s.headshot}`}
              />
              <img
                src="/images/headshot.png"
                alt="A headshot of David wearing an unbuttoned white collared shirt."
                className={`${s.headshot}`}
              />
            </div>
            <div className={`${s.socialSpacer}`} />
            <div className={`d-flex ${cs.center} ${s.socialRow}`}>
              {socials.map((s, i) => <SocialLink key={i} social={s} />)}
            </div>
          </div>

          <div className={`col-12 col-md-6 position-relative ${cs.center} p-1 py-3`} style={{zIndex: 10}}>
              <Circles fill="#FFFFFF25" stroke="#FFFFFF80" strokeWidth={1} style={{ width: "125%", minWidth: 750}} className={`position-absolute`} />
            <div className={`d-flex flex-column justify-content-center rounded-4 p-3 ${cs.frosted}`}>
              <span className={`display-6 m-0`}>Hi there, I’m</span>
              <h1 className={`display-4 m-0`}>David A Six</h1>
              <br />
              <span>I’m a developer, maker, and tech enthusiast.</span>
              <span>
                Why the six? I’m the sixth David Anderson in my family tree!
              </span>
              <br />
              <span>
                Curious about what I bring to the table? Check out my projects and skills above!
              </span>
            </div>
          </div>
        </section>
      </NavigationLayout>
    </>
  );
}

    