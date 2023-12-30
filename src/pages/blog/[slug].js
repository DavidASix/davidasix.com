import { useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "src/components/Firebase";

import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { SlShareAlt } from "react-icons/sl";

import NavigationLayout from 'src/components/NavigationLayout/';
import cs from "src/styles/common.module.css";

async function getPost(slug) {
  const postQuery = query(collection(db, "blog"), where("slug", "==", slug));
  const querySnapshot = await getDocs(postQuery);
  let posts = [];
  // querySnapshot contains a QuerySnapshot object, which has a method named forEach.
  // This use of forEach is not the method available on arrays
  querySnapshot.forEach((doc) => posts.push(doc.data()));

  if (!posts.length) {
    // Blog post not found
    console.log("Post not found");
  } else if (posts.length > 1) {
    // Duplicate slugs found
    console.log("Duplicate posts");
  }
  // Single post has been found, now retrieve the extra data around it
  let post = posts[0];
  post.header_image = await getDownloadURL(ref(storage, post.header_image));
  // Get URLs for Image Content
  for (let contentItem of post.content) {
    if (contentItem.type === "images") {
      const images = contentItem.value;
      contentItem.value = await Promise.all(
        images.map(async (imagePath) => {
          const imageRef = ref(storage, imagePath);
          const downloadUrl = await getDownloadURL(imageRef);
          return downloadUrl;
        })
      );
    }
  }
  return post;
}

export const getServerSideProps = async ({ params }) => {
  const post = await getPost(params.slug);
  let minutesToRead = 0;
  const wpm = 200;
  post.content.forEach((block, i) => {
    let increase = 0;
    if (["text", "quote"].includes(block.type))
      increase = block.value.split(" ").length / wpm;
    // Assumes each image in the article takes 6 seconds for user to review
    if (block.type === "images") increase = block.value.length * 0.1;
    minutesToRead += increase;
  });
  minutesToRead = Math.ceil(minutesToRead);
return { props: { post: JSON.stringify(post), minutesToRead } }
}

export default function BlogPost({ params, post, minutesToRead }) {
  const blog = JSON.parse(post);
  return (
    <>
      <Head>
        <title>{blog.title || 'Article'} | DavidASix</title>
      </Head>
      <NavigationLayout>
        <article className="row justify-content-center col-xl-6 col-lg-8 col-sm-10 col-12">
          <div className="d-flex flex-row align-items-center justify-content-between flex-nowrap border-bottom pt-1 pb-3 mb-3">
            <a href='/blog' className="fs-small">
              ⬅ Blog Home
            </a>
            <button 
              className='p-0 m-0 bg-transparent border-0 stealth-btn'
              aria-label='Copy URL to clipboard'
              data-bs-toggle="tooltip" 
              data-bs-title="URL Copied"
              data-bs-trigger='click'
              onClick={() => navigator.clipboard.writeText(window.location.href)}>
              <SlShareAlt style={{ fill: 'inherit' }} />
            </button>
          </div>
          <section 
            id='header'
            className="row p-0 pb-3 col-12 justify-content-center">
            <h1 className="h1 text-start fw-bold">
              {blog.title}
            </h1>
            <h2 className="h5 text-muted text-start">
              {blog.sub_title}
            </h2>
            <div className="d-flex flex-row align-items-center flex-wrap mb-2">
              {blog?.topics.length && (<span className='text-muted me-1 fw-bold fs-small'>Topics:</span>)}
              {blog.topics.map((topic, i) => (
                <div key={i} className="badge rounded-pill bg-light border text-muted m-1 mx-1 d-flex align-items-center">
                  {topic}
                </div>
              ))}
            </div>
            {/* add topics covered and share link */}
            <small className="ms-1">
              Published:{" "}
              {blog.publish_date?.seconds && new Date(blog.publish_date?.seconds * 1000).toISOString().split('T')[0]}
            </small>
            <small className="ms-1">
              {minutesToRead} min read
            </small>
            <img
              src={blog.header_image}
              className={`col-12 col-lg-8`}
              style={{maxHeight: '50vh', objectFit: 'contain'}}
              alt="Header image"
            />
          </section>
          
          <article 
            id='content'
            className="row p-0 pb-3 col-12 justify-content-center">
            {blog.content.map((block, i) => {
              switch (block.type) {
                case "text":
                  return (
                    <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}>
                      {block.value}
                    </ReactMarkdown>
                  );
                case "images":
                  return (
                    <div className={`${cs.center} row w-100 mb-3`} key={i}>
                      {/* image blocks are an array of images. The image size is dependant on the number of images in the block. */}
                      {block.value.map((img, j) => (
                        <img
                          src={img}
                          className={`col-${[10, 6, 4][block.value.length - 1]} mt-3`}
                          style={{ maxHeight: '50vh', objectFit: 'contain' }}
                          alt="blog content image"
                          key={`${i}-${j}`}
                        />
                      ))}
                    </div>
                  );
                case "quote":
                  return (
                    <div key={i} className={`w-100 ${cs.center}`}>
                      <blockquote className={'w-75 text-center h4 border-top border-bottom mb-3 p-3'}>
                        {block.value}
                      </blockquote>
                    </div>
                  );
                default:
                  return null;
              }
            })}
            <span className="fst-italic text-muted fs-small text-center m-0 p-0">© Kate Urquhart Psychotherapy</span>
            <span className="fst-italic text-muted fs-small text-center m-0 p-0">kateurquhart.com</span>
          </article>
          <section 
            id='articleFooter'
            className="row p-0 pt-3 pb-0 col-12 justify-content-center border-top">
            <a href='/blog' className="fs-small mb-3 col-12">
              ⬅ Blog Home
            </a>
          </section>
        </article>
      </NavigationLayout>
    </>
  );
}
