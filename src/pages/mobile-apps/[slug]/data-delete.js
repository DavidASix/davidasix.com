import { collection, getDocs, query, where } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { db, storage } from "src/components/Firebase";
import NavigationLayout from "src/components/NavigationLayout/";

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

export default function DataDeleteInstructions(props) {
  const { app_str } = props;
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
          </div>
        </section>

        <section
          id="Links"
          className="col-12 row justify-content-center align-items-start my-3"
        >
          <div
            className={`col-12 col-md-10 col-lg-8 px-1 p-md-0 row justify-content-start`}
          >
            <a
              href={`/mobile-apps/${app.slug}`}
              className="badge border border-light rounded-pill hover hover-danger mx-2"
              style={{ width: "unset" }}
            >
              App Home
            </a>
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
                className="badge border border-light rounded-pill hover hover-danger mx-2"
                style={{ width: "unset" }}
              >
                Data Delete Policy
              </a>
            )}
          </div>
        </section>

        <section
          id="Policy"
          className={`col-12 row justify-content-center align-items-start`}
        >
          <div
            id="content"
            className={`frosted rounded-4 px-1 py-3 pt-0 col-12 col-md-10 col-lg-8 row justify-content-center`}
          >
            <h1 className="fs-d5">
                Data Delete Instructions
            </h1>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {app.dataDelete.replace(/\n/g, "  \n")}
            </ReactMarkdown>
          </div>
        </section>
      </NavigationLayout>
    </>
  );
}
