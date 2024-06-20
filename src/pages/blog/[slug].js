import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { SlShareAlt } from "react-icons/sl";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import NavigationLayout from "@/components/NavigationLayout";
import c from "@/assets/constants";

export const getServerSideProps = async ({ params }) => {
  let post = {};
  try {
    const { data } = await axios.post(`${c.domain}/api/cms/blog/post-by-slug`, {
      slug: params.slug,
    });
    post = data;
  } catch (err) {
    console.log(err);
  }
  return { props: { post: JSON.stringify(post) } };
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

export default function BlogPost({ post, minutesToRead }) {
  const blog = JSON.parse(post);
  console.log({ blog });

  function copyClicked() {
    navigator.clipboard.writeText(window.location.href);
    const tip = document.getElementById("copy-tip");
    tip.setAttribute(
      "class",
      "tooltip tooltip-primary tooltip-open tooltip-left"
    );
    tip.setAttribute("data-tip", "URL Copied to Clipboard");
  }

  return (
    <>
      <Head>
        <title>{`${blog?.title || "Article"} | DavidASix`}</title>
      </Head>
      <NavigationLayout>
        <section className={`${c.sectionPadding} w-full`}>
          <div className={`${c.contentContainer} w-full`}>
            <div className="flex justify-between items-center pb-4 mx-2 mb-8 border-b">
              <Link href="/blog" className="">
                ⬅ Blog Home
              </Link>
              <div
                id="copy-tip"
                className="tooltip tooltip-left"
                data-tip="Copy URL"
              >
                <button
                  className="fill-da-dark-50"
                  aria-label="Copy URL to clipboard"
                  data-bs-toggle="tooltip"
                  data-bs-title="URL Copied"
                  data-bs-trigger="click"
                  onClick={copyClicked}
                >
                  <SlShareAlt style={{ fill: "inherit" }} />
                </button>
              </div>
            </div>

            <article id="content" className="max-w-[1000px] mx-auto space-y-8">
              <section id="header">
                <h1 className="text-4xl font-bold text-start">{blog?.title}</h1>
                <h2 className="text-xl text-start">{blog.subtitle}</h2>
                <small className="ms-1">Published: {blog.publish_date}</small>
                <img
                  src={`${c.cms}${blog.header_image}`}
                  className={`rounded-2xl max-h-[45vh] w-auto mx-auto mt-4`}
                  alt="Header image"
                />
              </section>

              <section id="content">
                {blog.content_block.map((b, i) => (
                  <ContentBlock block={b} index={i} key={i} />
                ))}
                <p className="italic text-small text-center w-full mt-8">
                  © DavidASix | davidasix.com
                </p>
              </section>
              <section
                id="articleFooter"
                className="row p-0 pt-3 pb-0 col-12 justify-content-center border-top"
              >
                <Link
                  href="/blog"
                  className="fs-small hover hover-primary mb-3 col-12"
                >
                  ⬅ Blog Home
                </Link>
              </section>
            </article>
          </div>
        </section>
      </NavigationLayout>
    </>
  );
}
