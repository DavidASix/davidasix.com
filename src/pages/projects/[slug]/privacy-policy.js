import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import NavigationLayout from "@/components/NavigationLayout";

import c from "@/assets/constants";

export const getServerSideProps = async ({ params }) => {
  let project;
  try {
    const { data } = await axios.post(
      `${c.domain}/api/cms/projects/privacy-policy`,
      {
        slug: params.slug,
      }
    );
    project = data;
  } catch (err) {
    console.log("getServerSideProps Error");
  }
  return { props: { project_str: JSON.stringify(project) } };
};

export default function PrivacyPolicy({ project_str }) {
  const project = JSON.parse(project_str);
  return (
    <>
      <Head>
        <title>{`${project.title} | DavidASix`}</title>
      </Head>
      <NavigationLayout>
        <section className={`${c.sectionPadding} w-full`}>
          <div className={`${c.contentContainer} w-full max-w-[950px]`}>
            <div className="flex w-full">
              <div className="flex flex-col flex-1 justify-center items-start md:items-center px-2 order-2 md:order-1">
                <h1 className="text-3xl text-left font-bold md:text-6xl md:text-center md:mb-2">
                  {project.title}
                </h1>
                <p className="text-left text-sm px-1 md:px-0 md:text-base md:text-center">
                  {project.short_description}
                </p>
              </div>
              <img
                src={`${c.cms}${project.logo}`}
                className="h-28 w-28 md:h-44 md:w-44 rounded-2xl order-1 md:order-2"
                aria-label={`${project.title} logo`}
                alt={`${project.title} logo`}
              />
            </div>

            <div className="flex justify-center gap-8 py-8 max-w-[600px] mx-auto flex-wrap">
              <Link
                href={`/projects/${project.slug}`}
                className="font-bold hover:text-da-primary-400 transition-colors duration-150"
              >
                Project Writeup
              </Link>
              {project.data_delete && (
                <Link
                  href={`/projects/${project.slug}/data-delete`}
                  className="font-bold hover:text-da-primary-400 transition-colors duration-150"
                >
                  Data Delete Policy
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className={`${c.sectionPadding} w-full`} id="privacy-policy">
          <article
            className={`${c.contentContainer} w-full max-w-[950px] rich-text-container`}
          >
            <h1>Privacy Policy</h1>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.privacy_policy.replace(/\n/g, "  \n")}
            </ReactMarkdown>
          </article>
        </section>
      </NavigationLayout>
    </>
  );
}
