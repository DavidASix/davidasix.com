import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import Head from 'next/head';
import NavigationLayout from "src/components/NavigationLayout/";
import {
  BlogListItem,
  BlogSkeletonItem,
} from "src/components/Blog/";

import { db, storage } from "src/components/Firebase";

import constants from 'src/assets/constants';

const postsPerPage = 9;

const getPosts = (page) => new Promise(async (resolve, reject) => {
  const currentPage = (page || 1) * 1;
  // Get Blog snapshot
  const blogCollection = collection(db, "blog");
  const q = query(blogCollection, 
    //where("status", "==", "published"),
    orderBy("created_on", "desc"));
  const blogSnapshot = await getDocs(q);

  // Get current page of posts
  let posts = blogSnapshot.docs.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  posts = posts.map(async (doc, i) => {
    const docData = doc.data();
    let header_image = await getDownloadURL(ref(storage, docData.header_image));
    return {
      ...docData,
      id: doc.id,
      header_image,
    };
  });

  posts = await Promise.all(posts);
  return resolve(posts);
});

const getMaxPage = () => new Promise(async (resolve, reject) => {
  // Get Blog snapshot
  const blogCollection = collection(db, "blog");
  const q = query(blogCollection, orderBy("created_on", "desc"));
  const blogSnapshot = await getDocs(q);
  // Organize pagination information
  const numberOfPages = Math.ceil(blogSnapshot.size / postsPerPage);

  return resolve(numberOfPages);
});

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(null);
  const [loadingNextPage, setLoadingNextPage] = useState();

  useEffect(() => {
    const setInitialPosts = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const postsFetch = await getPosts(1);
      setPosts(postsFetch)
      const maxPageFetch = await getMaxPage();
      setMaxPage(maxPageFetch);
    }
    setInitialPosts();
  }, []);

  async function loadNextPage() {
    try {
      setLoadingNextPage(true);
      const nextPage = currentPage + 1;
      const nextPagePosts = await getPosts(nextPage);
      setPosts([...posts, ...nextPagePosts])
      setCurrentPage(nextPage);
    } catch (err) {
      alert('Could not find more blog posts.')
      console.log(err)
    } finally {
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoadingNextPage(false);
    }
  }
  console.log(maxPage)
  return (
    <>
      <Head>
        <title>{`${constants.siteName} | Blog`}</title>
      </Head>
      <NavigationLayout>
        <section 
          id='header'
          className='position-relative col-12 row justify-content-center p-0 m-0 mb-4 '>
          <div
            className={`col-lg-10 col-12`}>
            <h1 
              className="display-4 headerFont p-0 ps-2"
              style={{zIndex: 10}}>
              My Blog Title
            </h1>
            <span className="fs-6 ps-4">
              Blog Subheader
            </span>
          </div>
        </section>

        <section 
          id='Blog Entries'
          className="col-12 col-lg-7 row justify-content-start align-items-start p-0 m-0"
          style={{zIndex: 15}}>
          {/* If there are no posts yet, render a skeleton layout. */}
          {maxPage === null && Array.from({ length: 3 }).map((_, i) => <BlogSkeletonItem key={i} />)}
          {posts.map((post, i) => <BlogListItem key={i} post={post} />)}
          {loadingNextPage && <BlogSkeletonItem />}
          <div className="col-12 mt-3 d-flex justify-content-center">
            {currentPage === maxPage ? (
              <span className="fs-small text-muted">
              </span>
            ) : (
            <button 
              className="btn btn-outline-primary rounded-pill px-4 py-1"
              onClick={loadNextPage}>
              Load More
            </button>
            )}
          </div>
        </section>

        <section 
          className={`row d-lg-flex d-none col-3 p-0 m-0 ps-3 sticky-top`} 
          style={{top: 'var(--nav-height)'}}>
          <h1 className="mb-2 h3">
            What is this about?
          </h1>
          <p>
            Here is a description about the blog
          </p>
          {/*
            TODO: Add filtering for topic and publish date.
          */}
        </section>
      </NavigationLayout>
    </>
  );
}
