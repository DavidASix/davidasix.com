import Head from 'next/head';
import s from "src/pages/home.module.css";
import cs from "src/styles/common.module.css";
import NavigationLayout from 'src/components/NavigationLayout/';

import Github from "public/images/icons/github.svg";
import Instagram from "public/images/icons/instagram.svg";
import YouTube from "public/images/icons/youtube.svg";
import Email from "public/images/icons/email.svg";

import Circles from "public/images/shapes/circle-scatter.svg";
import GithubWave from "public/images/shapes/wave-seperator-1.svg";


const socials = {
  github: {
    link: "https://github.com/DavidASix",
    icon: (props) => <Github alt="Github Icon" {...props} />,
    title: "Github"
  },
  instagram: {
    link: "https://www.instagram.com/dave6dev",
    icon: (props) => <Instagram alt="Instagram Icon" {...props} />,
    title: "Instagram"
  },
  youtube: {
    link: "https://www.youtube.com/channel/@Dave6",
    icon: (props) => <YouTube alt="YouTube Icon" {...props} />,
    title: "YouTube"
  },
  email: {
    link: "mailto:dave6@dave6.ca",
    icon: (props) => <Email alt="Email Icon" {...props} />,
    title: "Email"
  },
}

const SocialLink = ({social}) => {
  const Icon = (props) => socials[social].icon(props);
  return (
    <a 
      href={socials[social].link} 
      className={`rounded-4 mx-2 ${cs.center} ${cs.frosted} ${cs.grow} ${s.socialContainer}`}>
      <Icon style={{height: "70%", width: "70%", fill: "var(--text)" }} />
    </a>
  );
}

async function getProgrammingProjects() {
  return {
    stoplight: {
      icon: "123",
      title: "BLE Stop Light",
      description: "Dignissim proin volutpat praesent, adipisci potenti, veritatis quae, ut, lacus hymenaeos lacus platea vulputate habitasse rem expedita ac.",
      language: "C++, React-Native"
    },
    midwife: {
      icon: "123",
      title: "Midwife Mobile",
      description: "Dignissim proin volutpat praesent, platea vulputate habitasse rem expedita ac.",
      language: "React-Native"
    },
    automouse: {
      icon: "123",
      title: "Arduino Automouse",
      description: "Lacus hymenaeos lacus platea vulputate habitasse rem expedita ac.",
      language: "C++"
    }
  };
}

export const getServerSideProps = async () => {
  const projects = await getProgrammingProjects();

  return { props: { projects } }
}
 
export default function Home({projects}) {
  return (
    <>
      <Head>
      </Head>
      <NavigationLayout>
        <section className={`${cs.center} ${s.section} ${s.heroSection}`}>
          <div className={`row flex-md-row-reverse h-100 ${s.sectionContent}`}>
            <div className={`col-12 col-md-6 ${cs.center}`} style={{zIndex: 50}}>
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
                <div className={`d-flex ${cs.center} ${s.socialRow}`}>
                  {Object.keys(socials).map((s, i) => <SocialLink key={i} social={s} />)}
                </div>
              </div>
            </div>

            <div className={`col-12 col-md-6 position-relative ${cs.center}`} style={{zIndex: 30}}>
                <Circles fill="#FFFFFF25" stroke="#FFFFFF80" strokeWidth={1} style={{ width: "125%", minWidth: 750}} className={`position-absolute`} />
              <div
                className={`d-flex flex-column justify-content-center rounded-4 p-3 ${cs.frosted}`}
                style={{position: "relative", zIndex: 20 }}
              >
                <h2>Hi there, I’m</h2>
                <h1>David A Six</h1>
                <br />
                <span>I’m a developer, maker, and tech enthusiast.</span>
                <span>
                  Why the six? I’m the sixth David Anderson in my family tree!
                </span>
                
              </div>
            </div>
          </div>
          <GithubWave preserveAspectRatio="none" className={`position-absolute ${s.githubWave}`} />
        </section>

        <section className={`d-flex justify-content-center align-items-start ${s.section} ${s.lastSection} ${s.githubSection}`}>
          <div className={`row ${s.sectionContent}`}>

            <div className={`row border-bottom ${cs.center} position-relative`} style={{minHeight: 50}}>
              <div className={`col-3`} />
              <div className={`col-9 align-items-center justify-content-start`}>
                <span className={`px-2`}>Projects</span>
                <span className={`px-2`}>Education</span>
                <span className={`px-2`}>Ideaology</span>
              </div>
              <div className={`border`} style={{position: "absolute", height: "100%", width: "100vw"}} />
            </div>

            <div className={`row`}>
              <div className={`col-3`} style={{marginTop: -30}}>
                <div className={`${s.githubHeadshotContainer}`}>
                  <img
                    src="/images/headshot.png"
                    alt="A headshot of David wearing a white collared shirt and a red tie."
                    className={s.githubHeadshot}
                  />
                </div>
                <h2 className={`${cs.githubText}`} style={{fontWeight: 600}}>David Anderson 6</h2>
                <h3 className={`${cs.githubText} ${cs.muted}`} style={{fontWeight: 100}}>DavidASix</h3>
                <a href="http://www.github.com/DavidASix" className={`btn btn-secondary w-100 m-3`}>
                  Github Page
                </a>
                <span className={`${cs.githubText}`}>
                  Welcome to the GitHub of David Anderson the sixth! I am a full stack developer with a focus on mobile apps developed with React Native.
                </span>
              </div>
              <div className={`col-9 align-items-center justify-content-start`}>
                <div className={`row`}>
                  <h2 className={`${cs.githubText}`}>Programming Projects</h2>
                </div>
                <div className={`row m-3 justify-content-start`}>
                </div>
              </div>
            </div>
          </div>
        </section>
      </NavigationLayout>
    </>
  );
}

    