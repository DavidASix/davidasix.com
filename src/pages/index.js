import Head from 'next/head';
import s from "src/pages/home.module.css";
import cs from "src/styles/common.module.css";
import NavigationLayout from 'src/components/NavigationLayout/';

import Circles from "public/images/shapes/circle-scatter.svg";

const SocialLink = ({social}) => {
  return (
    <a 
      href={social.link} 
      className={`rounded-4 mx-2 ${cs.center} ${cs.frosted} ${cs.grow} ${s.socialContainer}`}>
      <span>{social.title}</span>
    </a>
  );
}

async function getSocialAccounts() {
  const socialAccounts = [
    {
      type: 'github',
      link: "https://github.com/DavidASix",
      title: "Github"
    },
    {
      type: 'instagram',
      link: "https://www.instagram.com/dave6dev",
      title: "Instagram"
    },
    {
      type: 'youtube',
      link: "https://www.youtube.com/channel/@Dave6",
      title: "YouTube"
    },
    {
      type: 'email',
      link: "mailto:dave6@dave6.ca",
      title: "Email"
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
          <div className={`col-12 col-md-6 position-relative flex-column ${cs.center}`} style={{zIndex: 20}}>
            <div className={`${s.headshotContainer}`}>
              <img
                src="/images/headshot_bg.svg"
                alt="An orange circle behind image of David"
                className={s.headshot}
              />
              <img
                src="/images/headshot.png"
                alt="A headshot of David wearing a white collared shirt and a red tie."
                className={s.headshot}
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
              <h2>Hi there, I’m</h2>
              <h1>David A Six</h1>
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

    