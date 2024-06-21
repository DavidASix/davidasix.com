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
  return (
    <>
      <Head>
        <title>{`${c.siteName} | ${project.title}`}</title>
      </Head>
      <NavigationLayout>
        <section className={`${c.sectionPadding} w-full`}>
          <div className={`${c.contentContainer} w-full`}>
            <div className="mb-8 md:mb-4">
              <h1 className={`text-7xl header-font text-center text-nowrap`}>
                {project.title}
              </h1>
              <p className={`text-center max-w-[700px] mx-auto mt-8`}>
                A collection of my programming and personal projects.
                <br />
                Here you'll find examples of my personal and professional work.
                Projects in Javascript, Python and more.
              </p>
            </div>
          </div>
        </section>

        <section className={`${c.sectionPadding} w-full`}>
          <div className={`${c.contentContainer} w-full space-y-4`}></div>
        </section>
      </NavigationLayout>
    </>
  );
}
