/* eslint-disable @next/next/no-img-element */
// TODO: Switch to using Image when I re-write this page
import { HydrateClient } from "~/trpc/server";

import { socials } from "~/lib/constants";

const SocialLink = (props: (typeof socials)[number]) => {
  const { url, icon: SocialIcon } = props;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-background/30 flex h-12 w-12 items-center justify-center rounded-2xl backdrop-blur-sm"
    >
      <SocialIcon className="text-foreground/80 h-8 w-8" />
    </a>
  );
};

export default async function Home() {
  return (
    <HydrateClient>
      <main className="bg-foreground/25">
        <section className="section section-padding w-full">
          <div className="content relative grid w-full grid-cols-1 px-4 pb-4 md:grid-cols-2 md:py-8">
            <div className="relative order-2 col-span-1 flex items-center justify-center md:order-1">
              <div className="z-10 mt-6 flex h-min max-w-[700px] flex-col rounded-2xl p-4 md:mt-0">
                <span className="text-xl font-medium">Hi there, I’m</span>
                <h1 className="font-jersey-10 text-7xl">David A Six</h1>
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

            <div className="relative order-1 col-span-1 flex justify-center md:order-2">
              <img
                src="/images/headshot-square.png"
                alt="A headshot of David wearing an unbuttoned white collared shirt."
                className="z-10 max-h-[60vh]"
              />
              <div className="absolute -bottom-5 z-20 flex h-min gap-2">
                {socials.map((social, i) => (
                  <SocialLink key={i} {...social} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section section-padding w-full">
          <div className="content">
            <h2 className="font-jersey-10 px-2 pb-2 text-6xl">
              A little about me
            </h2>

            <div className="blur-list relative grid grid-cols-3 grid-rows-8 justify-center px-1 md:grid-cols-6 md:grid-rows-4">
              <div className="col-span-1 row-span-1 p-1 md:col-span-1 md:row-span-1 md:p-2">
                <div className="bg-background/40 blur-li flex h-full w-full flex-col items-start justify-center rounded-2xl p-2 lg:p-4">
                  <h2 className="flex w-full flex-col text-center">
                    <span className="font-jersey-10 text-2xl font-bold sm:text-6xl">
                      {new Date().getFullYear() - 2017}
                    </span>
                    <span className="text-md sm:text-xl">
                      Years as a Developer
                    </span>
                  </h2>
                </div>
              </div>

              <div className="col-span-2 row-span-1 p-1 md:col-span-2 md:row-span-1 md:p-2">
                <div className="bg-background/40 blur-li flex h-full w-full flex-col items-start justify-center rounded-2xl p-2 lg:p-4">
                  <h2 className="text-md font-semibold sm:text-xl">
                    I&apos;ve worked with lots of tech
                  </h2>
                  <span className="text-sm sm:text-lg">
                    But I do most of my coding in these languages
                  </span>
                </div>
              </div>

              <img
                src="/images/nodejs.png"
                className="blur-li col-span-1 row-span-1 self-center md:col-span-1 md:row-span-1"
                aria-label="NodeJS"
                alt="NodeJS"
              />
              <img
                src="/images/python.png"
                className="blur-li col-span-1 row-span-1 self-center md:col-span-1 md:row-span-1"
                aria-label="Python"
                alt="Python"
              />
              <img
                src="/images/sql.png"
                className="blur-li col-span-1 row-span-1 self-center md:col-span-1 md:row-span-1"
                aria-label="SQL"
                alt="SQL"
              />

              <div className="col-span-2 row-span-1 p-1 md:col-span-2 md:row-span-1 md:p-2">
                <div className="bg-background/40 blur-li flex h-full w-full flex-col items-start justify-center rounded-2xl p-2 lg:p-4">
                  <span className="text-sm sm:text-lg">
                    I&apos;ve worn red shoes for years, and they inspired the
                    name for my web-design company,{" "}
                    <a
                      href="https://redoxfordonline.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary font-bold transition-colors"
                    >
                      Red Oxford Online
                    </a>
                    .
                  </span>
                </div>
              </div>

              <img
                className="blur-li col-span-1 row-span-1 self-center md:col-span-1 md:row-span-1"
                src="/images/low-poly-red-shoes.png"
                alt="A pair of red oxford shoes"
              />

              <div className="col-span-1 row-span-1 p-1 md:col-span-1 md:row-span-1 md:p-2">
                <div className="bg-background/40 blur-li flex h-full w-full flex-col items-start justify-center rounded-2xl p-2 lg:p-4">
                  <h2 className="flex w-full flex-col text-center">
                    <span className="font-jersey-10 text-2xl font-bold sm:text-6xl">
                      {new Date().getFullYear() - 2019}
                    </span>
                    <span className="text-md sm:text-xl">
                      Years in Sales & Business
                    </span>
                  </h2>
                </div>
              </div>

              <div className="col-span-2 row-span-1 p-1 md:col-span-2 md:row-span-1 md:p-2">
                <div className="bg-background/40 bg-da-primary bg-opacity-30 blur-li flex h-full w-full flex-col items-start justify-center rounded-2xl p-2 lg:p-4">
                  <h2 className="text-xl font-semibold whitespace-nowrap sm:text-2xl">
                    Corporate & Startups
                  </h2>
                  <span className="text-sm sm:text-lg">
                    My varied experience has allowed me to develop excellent
                    communication and leadership skills
                  </span>
                </div>
              </div>

              <img
                className="blur-li col-span-1 row-span-2 hidden self-center md:block"
                src="/images/low-poly-shepherd-1x2.png"
                alt="A German Shepherd"
              />

              <img
                className="blur-li col-span-1 row-span-1 block self-center md:hidden"
                src="/images/low-poly-shepherd-head.png"
                alt="A German Shepherd"
              />

              <div className="col-span-2 row-span-1 p-1 md:col-span-2 md:row-span-1 md:p-2">
                <div className="bg-background/40 bg-da-accent bg-opacity-30 blur-li flex h-full w-full flex-col items-start justify-center rounded-2xl p-2 lg:p-4">
                  <span className="text-center text-xl font-semibold sm:text-2xl">
                    I have a dog
                  </span>
                  <span className="text-sm sm:text-lg">
                    His name is Zachary. He is very cute.
                  </span>
                </div>
              </div>

              <div className="col-span-2 row-span-1 p-1 md:col-span-2 md:row-span-1 md:p-2">
                <div className="bg-background/40 blur-li flex h-full w-full flex-col items-start justify-center rounded-2xl p-2 lg:p-4">
                  <span className="text-sm sm:text-lg">
                    I&apos;m a huge fan of{" "}
                    <span className="font-bold">Cyberpunk.</span> Whether
                    it&apos;s books, games, movies or TV, if it&apos;s Cyberpunk
                    I&apos;m willing to give it a try.
                  </span>
                </div>
              </div>

              <img
                className="blur-li col-span-1 row-span-1 self-center p-2 md:col-span-1 md:row-span-1"
                src="/images/electric-sheep.png"
                alt="An Electric Sheep"
              />

              <div className="col-span-1 row-span-1 p-1 md:col-span-1 md:row-span-1 md:p-2">
                <div className="bg-background/40 blur-li flex h-full w-full flex-col justify-center rounded-2xl p-2 md:items-start lg:p-4">
                  <span className="text-xl md:text-xl">
                    I run on <b>Linux</b>. <br />
                  </span>
                  <span className="hidden flex-col text-sm sm:text-lg md:flex">
                    <span className="font-jersey-10 inline">Framework13</span>{" "}
                    and a{" "}
                    <span className="font-jersey-10 inline">
                      System76 Adder
                    </span>{" "}
                    on Ubuntu
                  </span>
                </div>
              </div>

              <img
                className="blur-li col-span-1 row-span-1 self-center p-2 md:col-span-1 md:row-span-1"
                src="/images/penguin.webp"
                alt="An Electric Sheep"
              />

              <div className="col-span-1 row-span-1 p-1 md:col-span-1 md:row-span-1 md:hidden md:p-2">
                <div className="bg-background/40 blur-li flex h-full w-full flex-col justify-center rounded-2xl p-2 md:items-start lg:p-4">
                  <span className="text-md flex flex-col sm:text-lg">
                    <span className="font-jersey-10 inline">Framework13</span>{" "}
                    and a{" "}
                    <span className="font-jersey-10 inline">
                      System76 Adder
                    </span>{" "}
                    on Ubuntu
                  </span>
                </div>
              </div>

              <div className="col-span-3 row-span-1 p-1 md:col-span-3 md:row-span-1 md:p-2">
                <div className="bg-background/40 blur-li flex h-full w-full flex-col items-start justify-center rounded-2xl p-2 lg:p-4">
                  <span className="text-sm md:text-lg">
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
      </main>
    </HydrateClient>
  );
}
