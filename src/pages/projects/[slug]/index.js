import React, { useState } from "react";
import Head from "next/head";
import axios from "axios";

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

export default function Project({ project_str }) {
  let project = JSON.parse(project_str);
  const links = [
    {
      url: project.project_url,
      helpText: "View the project",
      image: "/images/apple-store-button.png",
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
      image: "/images/github-button.png",
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
                  return null;
                }
                return (
                  <a
                    href={link.url}
                    target="_blank"
                    className=""
                    title={link.helpText}
                    aria-label={link.helpText}
                  >
                    <img
                      src={link.image}
                      className="w-44 md:w-52 h-auto"
                      aria-label={link.helpText}
                      alt={link.helpText}
                    />
                  </a>
                );
              })}
            </div>
            <div className="flex justify-center gap-8 py-8 max-w-[600px] mx-auto flex-wrap">
              {project.privacy_policy && (
                <a
                  href={`/projects/${project.slug}/privacy-policy`}
                  className="font-bold hover:text-da-primary-400 transition-colors duration-150"
                >
                  Privacy Policy
                </a>
              )}
              {project.data_delete && (
                <a
                  href={`/projects/${project.slug}/data-delete`}
                  className="font-bold hover:text-da-primary-400 transition-colors duration-150"
                >
                  Data Delete Policy
                </a>
              )}
            </div>
          </div>
        </section>

        <section className={`${c.sectionPadding} w-full`}>
          <div className={`${c.contentContainer} w-full`}>
            
          </div>
        </section>
      </NavigationLayout>
    </>
  );
}
