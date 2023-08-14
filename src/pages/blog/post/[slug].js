import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import { useRouter } from 'next/router'

import NavigationLayout from 'src/components/NavigationLayout/';
import CurveHeader from "src/components/CurveHeader";

import cs from "src/styles/common.module.css";
import s from "./post.module.css";

// Initialize Firebase
import firebaseConfig from "src/assets/firebase-config.json";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// returns the content from the currently selected pages 10 blog post
async function getPost(slug) {
  const db = getFirestore();
  const storage = getStorage();
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
  console.log({ post })
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
  console.log({params})
  const post = await getPost(params.slug);
  let minutesToRead = 0;
  const wpm = 265;
  post.content.forEach((block, i) => {
    let increase = 0;
    if (["text", "quote"].includes(block.type))
      increase = block.value.split(" ").length / wpm;
    // Assumes each image in the article takes 6 seconds for user to review
    if (block.type === "images") increase = block.value.length * 0.1;
    minutesToRead += increase;
  });
  minutesToRead = Math.ceil(minutesToRead);
  console.log("--------------getServerSideProps Complete------------------")
return { props: { post: JSON.stringify(post), minutesToRead } }
}

export default function BlogPost({ params, post, minutesToRead }) {
  const blog = JSON.parse(post);
  return (
    <NavigationLayout>
      <section className={`${cs.header}`} />

      <section
        className={`row d-flex justify-content-center align-items-start py-3 ${cs.maxSection} ${cs.heroSection} position-relative`}
      >
        <div className="col-lg-8 col-sm-12 row" style={{ zIndex: 30 }}>
          <div className={`rounded-3 ${cs.frosted} p-3`}>
            <div
              className={`rounded-3 position-relative overflow-hidden ${cs.center} ${s.headerImageContainer}`}
            >
              <img
                src={blog.header_image}
                className={s.headerImageBg}
                alt="Header image"
              />
              <div
                className={`position-absolute p-2 overflow-hidden`}
                style={{ top: 0, bottom: 0, left: 0, right: 0 }}
              >
                <img
                  src={blog.header_image}
                  className={`w-100 h-100`}
                  style={{ objectFit: "contain" }}
                  alt="Header image"
                />
              </div>
            </div>
            <article className="d-flex flex-column justify-content-start align-items-start align-content-start">
              <h4 className="headerFont display-2">{blog.title}</h4>
              <h5 className="h1">{blog.sub_title}</h5>
              <small className="text-end">
                Published: {" "}
                {blog.publish_date?.seconds && new Date(blog.publish_date?.seconds * 1000).toISOString().split('T')[0]}
              </small>
              {blog.author && (
                <small className="text-end">By: {blog.author}</small>
              )}
              <br />
              {blog.content.map((block, i) => {
                switch (block.type) {
                  case "text":
                    return (
                      <p key={i} className="card-text">
                        {block.value}
                      </p>
                    );
                  case "images":
                    return (
                      <div className={`${cs.center} row w-100 mb-3`}>
                        {block.value.map((img, j) => (
                          <div
                            className={`${cs.center} col-lg-4 col-sm-10 my-2`}
                            style={{ maxHeight: "30vh" }}
                            key={`${i}-${j}`}
                          >
                            <img
                              src={img}
                              className={`rounded-3`}
                              style={{ maxWidth: "100%", maxHeight: "100%" }}
                              alt="blog content image"
                            />
                          </div>
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
            </article>
          </div>
        </div>

        <div
          className={`d-lg-flex  d-none col-lg-2 ms-3 row sticky-top`}
          style={{ zIndex: 30, top: 40 + 8 + 8 + 16 + 16 }}
        >
          <div className={`${cs.frosted} col-12 rounded-3 d-flex flex-column p-3`}>
            <Link href={`/blog`}>Blog Home</Link>
            <span className="h5 m-0 mt-3">{blog.title}</span>
            {blog.author && <span>By: {blog.author}</span>}
            <small>
              Published:{" "}
              {blog.publish_date?.seconds && new Date(blog.publish_date?.seconds * 1000).toISOString().split('T')[0]}
            </small>
            <small>{minutesToRead} min read</small>
          </div>
        </div>

        <CurveHeader style={{ zIndex: 10 }} />
      </section>
    </NavigationLayout>
  );
}
