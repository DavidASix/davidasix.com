import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL  } from "firebase/storage";
import querystring from "querystring";
import Link from "next/link";


import s from "./blog.module.css";
import cs from "src/styles/common.module.css";

import CurveHeader from 'src/components/CurveHeader';
// Initialize Firebase
import firebaseConfig from "src/assets/firebase-config.json";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const postsPerPage = 9;


function BlogListItem({ blog }) {
  // Extract first text block for preview
  const firstTextBlock = blog.content.find((block) => block.type === "text");
  return (
    <div className={`col-lg-4 col-md-12 p-3 d-flex`}>
      <div className={`p-3 rounded-3 ${cs.frosted}`}>
      <img src={header_image} className={`rounded-3`} style={{width:'100%', height:150, objectFit: 'cover' }} />
        <h4 className={`headerFont pb-3`}>{blog.name}</h4>
        <p>{firstTextBlock.value.substring(0, 128)}...</p>
        <p>
          <small>
            Published on{" "}
            {new Date(blog.publish_date.seconds * 1000).toLocaleDateString()}
          </small>
        </p>
        <Link href={`/blog/${blog.slug}`} className="btn btn-primary">
          Read More
        </Link>
      </div>
    </div>
  );
}

export default async function Blog({ searchParams }) {
  const [numberOfPages, setNumberOfPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [blogPosts, setPosts] = useState(null);
  useEffect(() => {
    async function pageSetup() {
      // Get Blog snapshot
      const blogCollection = collection(db, "blog");
      const query = query(blogCollection, orderBy("created_on", "desc"))
      const blogSnapshot = await getDocs(blogCollection);
      // Organize pagenation information
      setNumberOfPages(Math.ceil(blogSnapshot.size / postsPerPage));
      const currentPageNumber = (searchParams?.page || 1) * 1;
      setCurrentPage(currentPage);
      // Get current page of posts
      let posts = posts.slice((currentPageNumber - 1) * postsPerPage, currentPageNumber * postsPerPage);
      posts = posts.docs.map(async (doc) => {
        let header_image = await getDownloadURL(ref(storage, doc.header_image));
        return { ...doc.data(), id: doc.id, header_image };
      });
      posts = await Promise.all(posts)
      setPosts(posts)
    }
    pageSetup();
  })
  
  const pages = [...Array(numberOfPages)].map((_, i) => i + 1);

  return (
    <>
      <section className={`${cs.header}`} />

      <section className={`row d-flex justify-content-center align-items-start align-content-start ${cs.maxSection} ${cs.heroSection} p-0`}>
        <div className={`col-12 p-0 ${cs.center} flex-column`} style={{zIndex: 30}}>
          <h2 className={`mb-3 headerFont display-1`}>Blog</h2>
          <p style={{textAlign: 'center'}}>
          </p>
        </div>
        <div className={`row col-lg-10 col-sm-12 align-items-stretch`}>
          {blogPosts.map((post, i) => (
            <BlogListItem key={i} blog={post} />
          ))}
        </div>
        <div className={`${cs.center} ${s.indicatorContainer} row pt-3 col-lg-4 col-sm-10 mb-3 border-top`}>
          {pages.map((num) => (
            <Link
              key={num}
              href={`/blog?${querystring.stringify({ page: num })}`}
              className={`col-2 h3 ${cs.center} ${s.pageIndicator} ${num===currentPage && s.selectedPage}`}
            >
              {num}
            </Link>
          ))}
        </div>
        <CurveHeader style={{zIndex: 10}}/>
      </section>
    </>
  );
}
