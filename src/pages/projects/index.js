import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";

import NavigationLayout from "@/components/NavigationLayout";

import c from "@/assets/constants";

export const getServerSideProps = async () => {
  let projects = [];
  let categories = [];
  try {
    const { data } = await axios.get(`${c.domain}/api/cms/projects`);
    projects = data
    categories = Array.from(new Set(projects.map((p) => p.category)));
  } catch (err) {
    console.log(err);
  }
  return {
    props: {
      projects_str: JSON.stringify(projects),
      categories_str: JSON.stringify(categories),
    },
  };
};

export default function Projects({ projects_str, categories_str }) {
  let projects = JSON.parse(projects_str);
  let categories = JSON.parse(categories_str);

  return (
    <>
      <Head>
        <title>{`${c.siteName} | Projects`}</title>
      </Head>
      <NavigationLayout>
        <section className={`${c.sectionPadding} w-full`}>
          <div className={`${c.contentContainer} w-full`}>
            <div className="mb-8 md:mb-4">
              <h1 className={`text-7xl header-font text-center text-nowrap`}>
                Projects
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
          <div className={`${c.contentContainer} w-full space-y-4`}>
            {categories.map((category, i) => (
              <React.Fragment key={i}>
                <h1 className="text-5xl text-da-dark-300 font-light">
                  {category}
                </h1>
                <ul
                  id={category}
                  className="grid grid-cols-2 gap-4 blur-list"
                  key={i}
                >
                  {projects
                    .filter((p) => p.category === category)
                    .map((project, j) => (
                      <li className="col-span-2 md:col-span-1" key={j}>
                        <Link
                          href={`/projects/${project.slug}`}
                          className="frosted rounded-2xl h-full min-h-32 p-3 flex flex-col blur-li
                        transition-all duration-300 hover:scale-[1.01] hover:bg-da-primary-300 hover:bg-opacity-10"
                        >
                          <div className="flex space-x-4 mb-4">
                            <img
                              src={`${c.cms}${project.logo}`}
                              className="h-16 w-16 rounded-2xl"
                            />
                            <div className="flex flex-col justify-center">
                              <h2 className="text-2xl">{project.title}</h2>
                              <small className="text-base -mt-1">
                                {project.active_development
                                  ? "Active Development 🏗️"
                                  : "Project Complete 🏁"}
                              </small>
                            </div>
                          </div>
                          <p>{project.short_description}</p>
                          <b>Development Period</b>
                          <span className="text-sm">
                            {project.start_date} -{" "}
                            {project.completed_date || "Current"}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </React.Fragment>
            ))}
          </div>
        </section>
      </NavigationLayout>
    </>
  );
}
