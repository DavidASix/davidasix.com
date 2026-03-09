/* eslint-disable @next/next/no-img-element */
export const dynamic = "force-dynamic";

const images = [
  "confused.gif",
  "huh.gif",
  "obama.gif",
  "mess.gif",
  "no-connect.gif",
  "shining.gif",
  "jover.gif",
  "gavin.gif",
  "dexter-owo.gif",
];

const messages = [
  "uhhhhh, I think that link's lost",
  "bro the link is somewhere, just one more refresh, please bro",
  "honestly you typed in the url wrong. keep up.",
  "damn, that's crazy",
  "lol try refreshing again maybe or something idk",
  "go look at my pizza blog instead of the 404 page, it's way better",
];

export default function NotFound() {
  const image = images[Math.floor(Math.random() * images.length)];
  const message = messages[Math.floor(Math.random() * messages.length)];

  return (
    <section className="section section-padding w-full">
      <div className="content relative grid w-full grid-cols-1 px-4 pb-4 md:grid-cols-2 md:py-8">
        <div className="relative order-2 col-span-1 flex items-center justify-center md:order-1">
          <div className="z-10 mt-6 flex h-min max-w-[700px] flex-col rounded-2xl p-4 md:mt-0">
            <h1 className="font-jersey-10 text-[10rem] leading-none">404</h1>
            <span className="mt-2 text-xl">{message}</span>
          </div>
        </div>

        <div className="relative order-1 col-span-1 flex justify-center md:order-2">
          <img
            src={`/images/404/${image}`}
            alt="A lost gif"
            className="z-10 max-h-[60vh] rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}
