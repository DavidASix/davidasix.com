import { collection, getDocs, query, where } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { db, storage } from "src/components/Firebase";
import NavigationLayout from "src/components/NavigationLayout/";

import cs from "src/styles/common.module.css";

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
  const { app_str, params } = props;
  const app = JSON.parse(app_str);
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
                  href={app.appleStoreListing}
                  className="hover p-2 col-5 col-sm-4 col-md-3 row justify-content-center"
                  title="Download on the App Store"
                  aria-label="Download on the App Store"
                >
                  <img
                    src="/images/apple-store-button.png"
                    className="col-12"
                    aria-label="Download on the App Store"
                    alt="Download on the App Store"
                  />
                </a>
              )}
              {app.googlePlayLink && (
                <a
                  href={app.googlePlayLink}
                  className="hover p-2 col-5 col-sm-4 col-md-3 row justify-content-center"
                  title="Download on Google Play"
                  aria-label="Download on Google Play"
                >
                  <img
                    src="/images/google-play-button.png"
                    className="col-12"
                    aria-label="Download on Google Play"
                    alt="Download on Google Play"
                  />
                </a>
              )}
              {app.githubLink && (
                <a
                  href={app.githubLink}
                  className="hover p-2 col-5 col-sm-4 col-md-3 row justify-content-center"
                  title="View code on Github"
                  aria-label="View code on Github"
                >
                  <img
                    src="/images/github-button.png"
                    className="col-12"
                    aria-label="View code on Github"
                    alt="View code on Github"
                  />
                </a>
              )}
            </div>
          </div>
        </section>

        <section
          id="screenshots"
          className={`col-12 row justify-content-center align-items-start`}
        >
          <div
            className={`col-12 col-md-10 col-lg-8 px-1 p-md-0 row justify-content-center`}
          ></div>
        </section>

        <section
          id="Writeup"
          className={`col-12 row justify-content-center align-items-start`}
        >
          <div
            className={`col-12 col-md-10 col-lg-8 px-1 p-md-0 row justify-content-center`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {app.writeUp.replace(/\n/g, "  \n")}
            </ReactMarkdown>
          </div>
        </section>

        <section
          id="Links"
          className="col-12 row justify-content-center align-items-start mt-3"
        >
          <div
            className={`col-12 col-md-10 col-lg-8 px-1 p-md-0 row justify-content-start`}
          >
            {app.privacyPolicy && (
              <a
                href={`/mobile-apps/${app.slug}/privacy-policy`}
                className="badge border border-light rounded-pill hover hover-danger mx-2"
                style={{ width: "unset" }}
              >
                Privacy Policy
              </a>
            )}
            {app.dataDelete && (
              <a
                href={`/mobile-apps/${app.slug}/data-delete`}
                className="badge border border-light rounded-pill hover hover-danger"
                style={{ width: "unset" }}
              >
                Data Delete Policy
              </a>
            )}
          </div>
        </section>
      </NavigationLayout>
    </>
  );
}
