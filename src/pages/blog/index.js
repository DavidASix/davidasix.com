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
      //await new Promise(resolve => setTimeout(resolve, 500));
      setPosts([...posts, ...nextPagePosts])
      setCurrentPage(nextPage);
    } catch (err) {
      alert('Could not find more blog posts.')
      console.log(err)
    } finally {
      setLoadingNextPage(false);
    }
  }

  return (
    <>
      <Head>
        <title>{`${constants.siteName} | Blog`}</title>
      </Head>
      <NavigationLayout>
        <section className={`nav-padding col-12 row justify-content-center align-items-start`}>
            <div className={`col-12 col-md-10 col-lg-8 row justify-content-center`} style={{zIndex: 30}}>
              <h1 className={`fs-d1 text-center text-nowrap`}>
                Six Blog
              </h1>
              <p className={`text-center`}>
                In these posts you'll find stream of conciousness writing on productivity, programming, and my projects. 
                <br />
                No schedule, no particular topic, just some thoughts I decided to write down.
              </p>
            </div>
        </section>

        <section 
          id='Blog Entries'
          className="col-12 col-md-10 col-lg-9 col-xl-8 col-xxl-7 row justify-content-start align-items-start p-0 m-0"
          style={{zIndex: 15}}>
          {/* If there are no posts yet, render a skeleton layout. */}
          {maxPage === null && Array.from({ length: 3 }).map((_, i) => <BlogSkeletonItem key={i} />)}
          {posts.map((post, i) => <BlogListItem key={i} post={post} />)}
          {loadingNextPage && <BlogSkeletonItem />}
          <div className="col-12 mt-3 d-flex justify-content-center">
            {currentPage === maxPage && <p>That's all for now!</p> }
            {!loadingNextPage && currentPage !== maxPage && (
            <button 
              className="btn btn-primary rounded-pill px-4 py-1"
              onClick={loadNextPage}>
              Load More
            </button>
            )}
          </div>
        </section>
      </NavigationLayout>

    </>
  );
}
