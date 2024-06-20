import React, { useState } from "react";
import Head from "next/head";
import axios from "axios";

import NavigationLayout from "@/components/NavigationLayout";
import { BlogListItem, BlogSkeletonItem } from "@/components/Blog";

import c from "@/assets/constants";

const itemsPerPage = 3;

export const getServerSideProps = async () => {
  let posts = [];
  let max_page = 0;
  try {
    const { data } = await axios.post(`${c.domain}/api/cms/blog/posts`, {
      page: 1,
      itemsPerPage,
    });
    posts = data.posts;
    max_page = data.max_page;
  } catch (err) {
    console.log(err);
  }
  return { props: { posts_str: JSON.stringify(posts), max_page } };
};

export default function Blog({ max_page, posts_str }) {
  const [posts, setPosts] = useState(JSON.parse(posts_str));
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const maxPage = max_page * 1;

  async function loadNextPage() {
    try {
      setLoadingNextPage(true);
      const nextPage = currentPage + 1;
      const { data } = await axios.post(`${c.domain}/api/cms/blog/posts`, {
        page: nextPage,
        itemsPerPage,
      });
      console.log(data);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setPosts([...posts, ...data.posts]);
      // Update currentPage but max out at max page.
      setCurrentPage((prev) => {
        return prev >= maxPage ? maxPage : prev + 1;
      });
    } catch (err) {
      alert("Could not find more blog posts.");
      console.log(err);
    } finally {
      setLoadingNextPage(false);
    }
  }

  return (
    <>
      <Head>
        <title>{`${c.siteName} | Blog`}</title>
      </Head>
      <NavigationLayout>
        <section className={`${c.sectionPadding} w-full`}>
          <div className={`${c.contentContainer} w-full`}>
            <div className="col-span-6 mb-8 md:mb-4">
              <h1 className={`text-7xl header-font text-center text-nowrap`}>
                Blog
              </h1>
              <p className={`text-center max-w-[700px] mx-auto mt-8`}>
                In these posts you'll find stream of conciousness writing on
                productivity, programming, and my projects.
                <br />
                No schedule, no particular topic, just some thoughts I decided
                to write down.
              </p>
            </div>
          </div>
        </section>

        <section className={`${c.sectionPadding} w-full`}>
          <div className={`${c.contentContainer} w-full space-y-4`}>
            {posts.map((post, i) => (
              <BlogListItem key={i} post={post} />
            ))}
            {loadingNextPage && <BlogSkeletonItem />}
            <div className="w-full flex justify-center items-center">
              {currentPage === maxPage && <p>That's all for now!</p>}
              {!loadingNextPage && currentPage !== maxPage && (
                <button
                  className="btn btn-primary rounded-full text-lg min-h-min h-10 w-52"
                  onClick={loadNextPage}
                >
                  Load More
                </button>
              )}
            </div>
          </div>
        </section>
      </NavigationLayout>
    </>
  );
}
