import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import Head from "next/head";
import Markdown from "react-markdown";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import remarkGfm from "remark-gfm";
import { Remarkable } from 'remarkable';
var md = new Remarkable();

import { db, storage } from "src/components/Firebase";
import NavigationLayout from "src/components/NavigationLayout/";

import s from "./mobileApp.module.css";

async function getApp(slug) {
  const appQuery = query(
    collection(db, "mobile-apps"),
    where("slug", "==", slug)
  );
  const snapshot = await getDocs(appQuery);
  let apps = [];
  // querySnapshot contains a QuerySnapshot object, which has a method named forEach.
  // This use of forEach is not the method available on arrays
  snapshot.forEach((doc) => apps.push(doc.data()));

  if (!apps.length) {
    // App not found, redirect home
    console.log("App not found");
    return null;
  } else if (apps.length > 1) {
    // Duplicate slugs found
    // return to home page
    console.log("Duplicate posts");
    return null;
  }

  // Found single app
  let app = apps[0];
  // Get URL for App Icon
  app.appIcon = await getDownloadURL(ref(storage, app.appIcon));
  // Get URLs for screenshots
  if (app.screenshots) {
    let screenshotUrls = app?.screenshots.map(
      async (screenshot) => await getDownloadURL(ref(storage, screenshot))
    );
    screenshotUrls = await Promise.all(screenshotUrls);
    app.screenshots = screenshotUrls;
  }
  return app;
}

export const getServerSideProps = async ({ params }) => {
  const app = await getApp(params.slug);
  // error occured in fetch, redirect to home
  if (!app) {
    return {
      redirect: {
        destination: "/mobile-apps",
        permanent: false,
      },
    };
  }
  return { props: { app_str: JSON.stringify(app) } };
};

export default function MobileApp(props) {
  const { app_str } = props;
  const app = JSON.parse(app_str);
  const [currentImage, setCurrentImage] = useState(0);
  return (
    <>
      <Head>
        <title>{`${app.title} | DavidASix`}</title>
      </Head>
      <NavigationLayout>
        <section
          className={`nav-padding col-12 row justify-content-center align-items-start`}
        >
          <div
            className={`col-12 col-md-10 col-lg-8 px-1 p-md-0 row justify-content-center`}
            style={{ zIndex: 30 }}
          >
            <div className="col-9 row align-content-center justify-content-start order-2 order-md-1">
              <h1 className={`fs-1 fs-md-d1 text-start text-md-center`}>
                {app.title}
              </h1>
              <p className={`text-start text-md-center fs-small fs-md-6 mb-2`}>
                {app.shortDescription}
              </p>
            </div>
            <div className="col-3 m-auto order-1 order-md-2 p-1 p-md-2">
              <img
                src={app.appIcon}
                className="rounded-4 rounded-md-5 shadow"
                style={{ width: "100%", height: "auto", aspectRatio: 1 }}
                aria-label={`${app.title} App Icon`}
                alt={`${app.title} App Icon`}
              />
            </div>
            <div className="col-12 order-3 row justify-content-center">
              {app.appleStoreLink && (
                <a
                  href={app.appleStoreLink}
                  target='_blank'
                  className="hover p-2 col-5 col-sm-4 col-md-3 row justify-content-center"
                  title="Download on the App Store"
                  aria-label="Download on the App Store"
                >
                  <img
                    src="/images/apple-store-button.png"
                    style={{maxWidth: 200}}
                    aria-label="Download on the App Store"
                    alt="Download on the App Store"
                  />
                </a>
              )}
              {app.googlePlayLink && (
                <a
                  href={app.googlePlayLink}
                  target='_blank'
                  className="hover p-2 col-5 col-sm-4 col-md-3 row justify-content-center"
                  title="Download on Google Play"
                  aria-label="Download on Google Play"
                >
                  <img
                    src="/images/google-play-button.png"
                    style={{maxWidth: 200}}
                    aria-label="Download on Google Play"
                    alt="Download on Google Play"
                  />
                </a>
              )}
              {app.githubLink && (
                <a
                  href={app.githubLink}
                  target='_blank'
                  className="hover p-2 col-5 col-sm-4 col-md-3 row justify-content-center"
                  title="View code on Github"
                  aria-label="View code on Github"
                >
                  <img
                    src="/images/github-button.png"
                    style={{maxWidth: 200}}
                    aria-label="View code on Github"
                    alt="View code on Github"
                  />
                </a>
              )}
            </div>
          </div>
        </section>

        <section
          id="Links"
          className="col-12 row justify-content-center align-items-center mt-3"
        >
          <div
            className={`col-12 col-md-10 col-lg-8 px-1 p-md-0 row justify-content-center`}
          >
            {app.privacyPolicy && (
              <a
                href={`/mobile-apps/${app.slug}/privacy-policy`}
                className="hover hover-danger mx-2 fw-bold"
                style={{ width: "unset" }}
              >
                Privacy Policy
              </a>
            )}
            {app.dataDelete && (
              <a
                href={`/mobile-apps/${app.slug}/data-delete`}
                className="hover hover-danger mx-2 fw-bold"
                style={{ width: "unset" }}
              >
                Data Delete Policy
              </a>
            )}
          </div>
        </section>

        <section
          id="screenshots"
          className={`col-12 row justify-content-center align-items-start`}
        >
          <div
            className={`my-3 col-12 col-md-10 col-lg-8 px-1 p-md-0 row justify-content-center`}
          >
            <div className="col-1 position-relative">
              <button
                onClick={() =>
                  setCurrentImage(
                    currentImage > 0 ? currentImage - 1 : currentImage
                  )
                }
                className={`frosted ${s.carouselButton} ${s.carouselButtonLeft}`}
              >
                <FaChevronLeft size='45%' />
              </button>
            </div>
            {app.screenshots && (
              <div className={`col-10 rounded-4 ${s.carouselWrapper}`}>
                {/* This div is the same aspect ratio as the images, so it can be centered to ensure the below div starts the first image in the center  */}
                <div className={`${s.carouselCenter}`}>
                  {/* This div has all images in a row, they are cut off by carouselWrapper */}
                  <div
                    className="d-inline position-absolute"
                    style={{ width: `${(app.screenshots.length + 1) * 100}%` }}
                  >
                    {app.screenshots.map((screenshot, i) => (
                      <img
                        src={screenshot}
                        alt={`${app.title} Screenshot ${i + 1}`}
                        key={i}
                        className={`${s.carouselImage} rounded-4`}
                        style={{
                          transform: `translateX(-${currentImage * 100}%)`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="col-1 position-relative">
              <button
                onClick={() =>
                  setCurrentImage(
                    currentImage < app.screenshots.length - 1
                      ? currentImage + 1
                      : currentImage
                  )
                }
                className={`frosted ${s.carouselButton} ${s.carouselButtonRight}`}
              >
                <FaChevronRight size='45%' />
              </button>
            </div>
          </div>
        </section>

        <section
          id="Writeup"
          className={`col-12 row justify-content-center align-items-start`}
        >
          <div
            className={`col-12 col-md-10 col-lg-8 px-1 p-md-0 row justify-content-between`}
          >
            {app?.featureList ? app.featureList.join('') && (
              <div className="col-12 col-md-6">
                <h2>Features</h2>
                <ul className="p-0">
                  {app.featureList.map((feature, i) => (
                    <li 
                      className="badge border border-light rounded-pill m-1"
                      key={i}>
                        {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            
            {app?.technologyList ? app.technologyList.join('') && (
              <div className="col-12 col-md-6">
                <h2>Technologies</h2>
                <ul className="p-0">
                  {app.technologyList.map((tech, i) => (
                    <li 
                      className="badge border border-light rounded-pill m-1"
                      key={i}>
                        {tech}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <h2>Project Description</h2>
            <article 
              id='content'
              className="mt-3 mx-0 " 
              style={{display: 'inline-block'}}>
              {app.writeUp.split('\n\n\n').map((line, i) => (
                <React.Fragment key={i}>
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {line.replace(/\n/g, "  \n")}
                  </Markdown>
                </React.Fragment>
              ))}
            </article>
          </div>
        </section>

      </NavigationLayout>
    </>
  );
}
