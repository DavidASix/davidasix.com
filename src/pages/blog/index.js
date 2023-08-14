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



const BlogListItem = ({ post }) => {
  // Extract first text block for preview
  const firstTextBlock = post.content.find((block) => block.type === "text");
  return (
    <div className={`col-lg-4 col-md-12 p-3 d-flex`}>
      <div className={`p-3 rounded-3 ${cs.frosted}`}>
      <img src={post.header_image} className={`rounded-3`} style={{width:'100%', height:150, objectFit: 'cover' }} />
        <h4 className={`headerFont pb-3`}>{post.name}</h4>
        <p>{firstTextBlock.value.substring(0, 128)}...</p>
        <p>
          <small>
            Published on{" "}
            {post.publish_date?.seconds && new Date(post.publish_date?.seconds * 1000).toISOString().split('T')[0]}
          </small>
        </p>
        <Link href={`/blog/${post.slug}`} className="btn btn-primary">
          Read More
        </Link>
      </div>
    </div>
  );
}


export const getServerSideProps = async ({ searchParams }) => {
    // Get Blog snapshot
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const storage = getStorage();
    const postsPerPage = 9;

    const blogCollection = collection(db, "blog");
    const q = query(blogCollection, orderBy("created_on", "desc"))
    const blogSnapshot = await getDocs(q);
    // Organize pagenation information
    const numberOfPages = (Math.ceil(blogSnapshot.size / postsPerPage));
    const currentPage = (searchParams?.page || 1) * 1;
    
    // Get current page of posts
    let posts = blogSnapshot.docs.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);
    posts = posts.map(async (doc, i) => {
      console.log(`Document${i}`)
      const docData = doc.data();
      let header_image = await getDownloadURL(ref(storage, docData.header_image));
      return { 
          ...docData, 
          id: doc.id, 
          header_image,
        };
    });

    posts = await Promise.all(posts)
    posts = JSON.stringify(posts)
    console.log("--------------getServerSideProps Complete------------------")
  return { props: { numberOfPages, currentPage, posts } }
}
 

export default function Blog({ searchParams, params, numberOfPages, currentPage, posts}) {
  const pages = [...Array(numberOfPages)].map((_, i) => i + 1);
  const blogPosts = JSON.parse(posts);
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
            <BlogListItem key={i} post={post} />
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
