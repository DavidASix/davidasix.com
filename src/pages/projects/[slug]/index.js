import React, { useState } from "react";
import Link from 'next/link';
import Head from "next/head";
import axios from "axios";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import NavigationLayout from "@/components/NavigationLayout";

import c from "@/assets/constants";

export const getServerSideProps = async ({ params }) => {
  let project = [];
  try {
    const { data } = await axios.post(`${c.domain}/api/cms/projects/by-slug`, {
      slug: params.slug,
    });
    project = data;
  } catch (err) {
    console.log("getServerSideProps Error");
  }
  return { props: { project_str: JSON.stringify(project) } };
};

const ContentBlock = ({ block }) => {
  /* eslint-disable react/prop-types */
  const { Text, Image } = block;
  const imgUrl = Image?.data?.attributes?.url;
  return (
    <section className="w-full flex flex-col items-start rich-text-container pb-4">
      {Text && <BlocksRenderer content={Text} />}
      {imgUrl && (
        <img
          src={`${c.cms}${imgUrl}`}
          className="object-contain object-center w-auto max-w-[700px] max-h-[40vh] rounded-2xl mx-auto"
        />
      )}
    </section>
  );
};

export default function Project({ project_str }) {
  let project = JSON.parse(project_str);
  const links = [
    {
      url: project.project_url,
      helpText: "View the project",
      image: "/images/view-online-button.webp",
    },
    {
      url: project.apple_store_url,
      helpText: "Download on the App Store",
      image: "/images/apple-store-button.png",
    },
    {
      url: project.google_play_url,
      helpText: "Download on Google Play",
      image: "/images/google-play-button.png",
    },
    {
      url: project.github_url,
      helpText: "View code on Github",
      image: "/images/github-button.webp",
    },
  ];

  return (
    <>
      <Head>
        <title>{`${c.siteName} | ${project.title}`}</title>
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

            <div className="flex justify-around gap-4 pt-8 max-w-[600px] mx-auto flex-wrap">
              {links.map((link, i) => {
                if (!link.url) {
                  return <React.Fragment key={i} />;
                }
                return (
                  <Link
                    key={i}
                    href={link.url}
                    target="_blank"
                    className="hover:scale-[1.01] transition-all duration-200"
                    title={link.helpText}
                    aria-label={link.helpText}
                  >
                    <img
                      src={link.image}
                      className="w-44 md:w-52 h-auto"
                      aria-label={link.helpText}
                      alt={link.helpText}
                    />
                  </Link>
                );
              })}
            </div>
            <div className="flex justify-center gap-8 py-8 max-w-[600px] mx-auto flex-wrap">
              {project.privacy_policy && (
                <Link
                  href={`/projects/${project.slug}/privacy-policy`}
                  className="font-bold hover:text-da-primary-400 transition-colors duration-150"
                >
                  Privacy Policy
                </Link>
              )}
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

        {project.screenshots && (
          <section id="screenshots" className={`${c.sectionPadding} w-full`}>
            <div className={`${c.contentContainer} w-full flex justify-center`}>
              <div className="w-full max-w-[800px] flex overflow-scroll p-4 space-x-4 frosted rounded-box">
                {project.screenshots.map((url, i) => (
                  <img
                    key={i}
                    src={`${c.cms}${url}`}
                    className="h-[50vh] w-auto rounded-box"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <section
          id="features&technology"
          className={`${c.sectionPadding} w-full`}
        >
          <div
            className={`${c.contentContainer} grid grid-cols-2 gap-2 max-w-[1200px] `}
          >
            <article className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start">
              <h2 className="text-xl font-semibold md:text-3xl my-4">
                Features
              </h2>
              <ul className="flex flex-wrap gap-2 justify-center md:justify-start">
                {project.features.map((feature, i) => (
                  <li
                    key={i}
                    className="inline-flex text-sm md:text-md px-4 py-1 rounded-full frosted hover:cursor-default"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </article>

            <article className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start">
              <h2 className="text-xl font-semibold md:text-3xl my-4">
                Technology
              </h2>
              <ul className="flex flex-wrap gap-2 justify-center md:justify-start">
                {project.technologies.map((tech, i) => (
                  <li
                    key={i}
                    className="inline-flex text-sm md:text-md px-4 py-1 rounded-full frosted hover:cursor-pointer"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section id="writeup" className={`${c.sectionPadding} w-full pt-8`}>
          <article className={`${c.contentContainer} max-w-[1200px]`}>
            {project.description_blocks.map((b, i) => (
              <ContentBlock block={b} index={i} key={i} />
            ))}
          </article>
        </section>
      </NavigationLayout>
    </>
  );
}
