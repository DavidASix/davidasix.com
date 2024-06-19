import React from "react";
import Head from "next/head";

import c from "@/assets/constants";

import NavigationLayout from "@/components/NavigationLayout";
import SocialIcon from "@/components/SocialIcon";

const socials = require("@/assets/socials.json");

const SocialLink = ({ social }) => {
  return (
    <div className="p-1">
      <a
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`frosted bg-da-dark-600 bg-opacity-20 rounded-2xl flex justify-center items-center aspect-square
        hover:bg-primary hover:bg-opacity-30`}
      >
        <SocialIcon
          social={social.socialMedia}
          className="p-2 fill-white hover:fill-da-secondary"
          style={{ height: 60, width: 70 }}
        />
      </a>
    </div>
  );
};

export default function Home(props) {
  return (
    <>
      <Head></Head>
      <NavigationLayout>
        <section className={`${c.sectionPadding} w-full`}>
          <div
            className={`${c.contentContainer} w-full grid grid-cols-1 md:grid-cols-2
              md:py-8 pb-4 relative px-4`}
          >
            <img
              src="/images/shapes/gradient-bg.png"
              alt="A gradient background"
              className="absolute left-0 top-0"
            />
            <div
              className={`col-span-1 relative flex justify-center items-center order-2 md:order-1`}
            >
              <div
                className={`flex flex-col md:frosted h-min max-w-[700px] p-4 rounded-2xl mt-6 md:mt-0`}
              >
                <span className={`text-xl header-font`}>Hi there, I’m</span>
                <h1 className={`text-4xl header-font`}>David A Six</h1>
                <span className="mt-2">
                  I’m a developer, maker, and tech enthusiast. Why the six? I’m
                  the sixth David Anderson in my family tree.
                </span>
                <span className="my-2">
                  Need a developer or data expert with proven soft and hard
                  skills? Here I am!
                </span>
              </div>
            </div>

            <div
              className={`col-span-1 relative flex justify-center order-1 md:order-2`}
            >
              <img
                src="/images/headshot_bg.svg"
                alt="An orange circle behind image of David"
                className="absolute bottom-0 z-0 max-h-[65vh]"
              />
              <img
                src="/images/headshot.png"
                alt="A headshot of David wearing an unbuttoned white collared shirt."
                className="z-10 max-h-[65vh]"
              />
              <div className="flex h-min absolute -bottom-5 z-20">
                {socials.map((s, i) => (
                  <SocialLink key={i} social={s} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`${c.sectionPadding} w-full`}>
          <div className={`max-w-[1250px] w-full`}>
            <img
              src="/images/shapes/gradient-bg.png"
              alt="A gradient background"
              className="absolute z-0"
            />

            <h2 className="text-4xl px-2 pb-2">A little about me</h2>

            <div
              className="relative justify-center 
              grid grid-cols-3 grid-rows-8 md:grid-cols-6 md:grid-rows-4 px-1"
            >
              <div className="col-span-1 row-span-1 md:col-span-1 md:row-span-1 p-1 md:p-2">
                <div className="h-full w-full flex flex-col justify-center items-start p-2 lg:p-4 frosted rounded-2xl">
                  <h2 className="flex flex-col w-full text-center">
                    <span className="text-3xl sm:text-5xl font-bold">
                      {new Date().getFullYear() - 2017}
                    </span>
                    <span className="text-md sm:text-xl">
                      Years as a Developer
                    </span>
                  </h2>
                </div>
              </div>

              <div className="col-span-2 row-span-1 md:col-span-2 md:row-span-1 p-1 md:p-2">
                <div className="h-full w-full flex flex-col justify-center items-start p-2 lg:p-4 frosted rounded-2xl">
                  <h2 className="text-md sm:text-xl font-semibold">
                    I've worked with lots of tech
                  </h2>
                  <span className="text-sm sm:text-lg">
                    But I do most of my coding in these languages
                  </span>
                </div>
              </div>

              <img
                src="/images/nodejs.png"
                className="col-span-1 row-span-1 md:col-span-1 md:row-span-1 self-center"
                aria-label="NodeJS"
                alt="NodeJS"
              />
              <img
                src="/images/python.png"
                className="col-span-1 row-span-1 md:col-span-1 md:row-span-1 self-center"
                aria-label="Python"
                alt="Python"
              />
              <img
                src="/images/sql.png"
                className="col-span-1 row-span-1 md:col-span-1 md:row-span-1 self-center"
                aria-label="SQL"
                alt="SQL"
              />

              <div className="col-span-2 row-span-1 md:col-span-2 md:row-span-1 p-1 md:p-2">
                <div className="h-full w-full flex flex-col justify-center items-start p-2 lg:p-4 frosted rounded-2xl">
                  <span className="text-sm sm:text-lg">
                    I've worn red shoes for years, and they inspired the name
                    for my webdesign company,{" "}
                    <a
                      href="https://redoxfordonline.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold hover:text-da-accent"
                    >
                      Red Oxford Online
                    </a>
                    .
                  </span>
                </div>
              </div>

              <img
                className="col-span-1 row-span-1 md:col-span-1 md:row-span-1 self-center"
                src="/images/low-poly-red-shoes.png"
                alt="A pair of red oxford shoes"
              />

              <div className="col-span-1 row-span-1 md:col-span-1 md:row-span-1 p-1 md:p-2">
                <div className="h-full w-full flex flex-col justify-center items-start p-2 lg:p-4 frosted rounded-2xl">
                  <h2 className="flex flex-col w-full text-center">
                    <span className="text-3xl sm:text-5xl font-bold">
                      {new Date().getFullYear() - 2019}
                    </span>
                    <span className="text-md sm:text-xl">
                      Years in Sales & Business
                    </span>
                  </h2>
                </div>
              </div>

              <div className="col-span-2 row-span-1 md:col-span-2 md:row-span-1 p-1 md:p-2">
                <div className="h-full w-full flex flex-col justify-center items-start p-2 lg:p-4 frosted rounded-2xl bg-da-primary bg-opacity-30">
                  <h2 className="text-xl sm:text-2xl font-semibold whitespace-nowrap">
                    Corporate & Startups
                  </h2>
                  <span className="text-sm sm:text-lg">
                    My varied experience has allowed me to develop excellent
                    communication and leadership skills
                  </span>
                </div>
              </div>

              <img
                className="col-span-1 row-span-2 hidden md:block self-center"
                src="/images/low-poly-shepherd-1x2.png"
                alt="A German Shepherd"
              />

              <img
                className="col-span-1 row-span-1 block md:hidden self-center"
                src="/images/low-poly-shepherd-head.png"
                alt="A German Shepherd"
              />

              <div className="col-span-2 row-span-1 md:col-span-2 md:row-span-1 p-1 md:p-2">
                <div className="h-full w-full flex flex-col justify-center items-start p-2 lg:p-4 frosted rounded-2xl bg-da-accent bg-opacity-30">
                  <span className="text-center text-xl sm:text-2xl font-semibold">
                    I have a dog
                  </span>
                  <span className="text-sm sm:text-lg">
                    His name is Zachary. He is very cute.
                  </span>
                </div>
              </div>

              <div className="col-span-2 row-span-1 md:col-span-2 md:row-span-1 p-1 md:p-2">
                <div className="h-full w-full flex flex-col justify-center items-start p-2 lg:p-4 frosted rounded-2xl">
                  <span className="text-sm sm:text-lg">
                    I'm a huge fan of{" "}
                    <span className="font-bold">Cyberpunk.</span> Whether it's
                    books, games, movies or TV, if it's Cyberpunk I'm willing to
                    give it a try.
                  </span>
                </div>
              </div>

              <img
                className="col-span-1 row-span-1 md:col-span-1 md:row-span-1 self-center p-2"
                src="/images/electric-sheep.png"
                alt="An Electric Sheep"
              />

              <div className="col-span-1 row-span-1 md:col-span-1 md:row-span-1 p-1 md:p-2">
                <div className="h-full w-full flex flex-col justify-center md:items-start p-2 lg:p-4 frosted rounded-2xl">
                  <span className="text-xl md:text-xl">
                    I run <b>Linux</b>. <br />
                  </span>
                  <span className="text-sm sm:text-lg hidden md:flex flex-col">
                    <span className="text-nowrap whitespace-nowrap">
                      PC: <b>Pop!_OS</b>
                    </span>
                    <span className="text-nowrap whitespace-nowrap">
                      Laptop: <b>Debian</b>
                    </span>
                    <span className="text-nowrap whitespace-nowrap">
                      Server: <b>Ubuntu</b>
                    </span>
                  </span>
                </div>
              </div>

              <img
                className="col-span-1 row-span-1 md:col-span-1 md:row-span-1 self-center p-2"
                src="/images/penguin.webp"
                alt="An Electric Sheep"
              />

              <div className="col-span-1 row-span-1 md:col-span-1 md:row-span-1 p-1 md:p-2 md:hidden">
                <div className="h-full w-full flex flex-col justify-center md:items-start p-2 lg:p-4">
                  <span className="text-md sm:text-lg flex flex-col">
                    <span className="text-nowrap whitespace-nowrap">
                      PC: <b>Pop!_OS</b>
                    </span>
                    <span className="text-nowrap whitespace-nowrap">
                      Laptop: <b>Debian</b>
                    </span>
                    <span className="text-nowrap whitespace-nowrap">
                      Server: <b>Ubuntu</b>
                    </span>
                  </span>
                </div>
              </div>

              <div className="col-span-3 row-span-1 md:col-span-3 md:row-span-1 p-1 md:p-2">
                <div className="h-full w-full flex flex-col justify-center items-start p-2 lg:p-4 frosted rounded-2xl">
                  <span className="text-lg md:text-lg">
                    I consider myself a lot of things, but first and foremost I
                    am a <span className="font-bold">problem solver</span>. When
                    I encounter a new challenge I use my skills in research and
                    analysis to find a creative solution.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </NavigationLayout>
    </>
  );
}
