import s from "./blog.module.css";
import cs from "src/styles/common.module.css";

export const BlogListItem = (props) => {
  let post = {...props.post};
  console.log(post)
  // Article text is stored in markdown format, this code removes the markdown for article preview
  let articleText = '';
  // Minutes to read is calculated to display how long it might take to read, similiar to Medium.
  let minutesToRead = 0;

  if (post?.content) {
    articleText = post.content.reduce(
        (accumulator, block) => {
          const markdownRegex = /[_*\[\]#\(\)~`>!\-|]/g;
          let text =  block.type === 'text' ? block.value : "";
          text = text.replace(markdownRegex, '');
          accumulator += text;
          return accumulator;
      }, '');

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
    }

    post.topics = post?.topics ? post.topics : [];

    return (
      <div className={`col-12 py-3 row px-1 m-0`}>
        <h2 className='col-12 text-start fw-bold m-0 p-0'>
          {post.title}
        </h2>
  
        <small className='col-12 p-0 fst-italic'>
          Published on{" "}
          {post.publish_date?.seconds &&
            new Date(post.publish_date?.seconds * 1000)
              .toISOString()
              .split("T")[0]}
        </small>
  
        <div className={`col-12 p-0 d-flex justify-content-center align-items-center`}>
          <a 
            href={`/blog/${post.slug}`}
            className='p-0 m-0 pe-1 position-relative' 
            style={{ flex: 1, maxHeight: 100, overflow: 'hidden' }}>
            <p className='m-0'>{articleText?.slice(0, 300)}...</p>
            <div className={s.readMore}>
              <span className="badge rounded-pill bg-light border text-muted m-0 d-flex py-0 align-items-center">
                Read More
              </span>
            </div>
          </a>
          <a 
            href={`/blog/${post.slug}`}
            style={{ backgroundImage: `url(${post.header_image})`}}
            className={`${s.blogItemImage} rounded-3`} />
        </div>
        
        <div className='d-flex flex-column justify-content-start align-items-start flex-md-row align-items-md-center m-0 p-0 mt-3'>
          <div className="d-flex flex-row align-items-center flex-wrap">
            {post?.topics.length && (<span className='text-muted me-1 fw-bold fs-small'>Topics:</span>)}
            {post?.topics.map((topic, i) => (
              <div key={i} className="badge rounded-pill bg-light border text-muted m-1 mx-1 d-flex align-items-center">
                {topic}
              </div>
            ))}
          </div>
  
          <div style={{ flex: 1}} className='d-flex justify-content-end align-items-center align-self-end py-1'>
            <span className='text-muted fs-small fst-italic me-2 text-nowrap'>
              {minutesToRead} minute read
            </span>
            <a href={`/blog/${post.slug}`} className="btn btn-primary p-0 px-2 rounded-pill fs-6 text-nowrap"  style={{justifySelf: 'end'}}>
              Read Entry
            </a>
          </div>
        </div>
      </div>
    );
  };


  export const BlogSkeletonItem = () => {
    return (
      <div className={`col-12 py-3 row px-1 m-0`}>
        <div
          className={`m-0 p-0 ${cs.skeleton}`}
          style={{ width: "25%", height: "2rem" }}
        />
  
        <div className="col-12 text-start fw-bold m-0 p-0">
          <div
            className={`m-0 m-0 mt-2 mx-1 p-0 ${cs.skeleton}`}
            style={{ width: "20%", height: "1rem" }}
          />
        </div>
  
        <div
          className={`col-12 p-0 d-flex justify-content-center align-items-center`}
        >
          <div
            className="p-0 m-0 pe-1 position-relative"
            style={{ flex: 1, maxHeight: 100, overflow: "hidden" }}
          >
            <div
              className={`m-0 my-1 mx-1 p-0 ${cs.skeleton}`}
              style={{ width: "100%", height: "1.1rem" }}
            />
            <div
              className={`m-0 my-1 mx-1 p-0 ${cs.skeleton}`}
              style={{ width: "100%", height: "1.1rem" }}
            />
            <div
              className={`m-0 my-1 mx-1 p-0 ${cs.skeleton}`}
              style={{ width: "100%", height: "1.1rem" }}
            />
            <div
              className={`m-0 my-1 mx-1 p-0 ${cs.skeleton}`}
              style={{ width: "100%", height: "1.1rem" }}
            />
          </div>
          <div
            className={`m-0 my-1 mx-1 p-0 ${cs.skeleton}`}
            style={{ width: 110, height: 110 }}
          />
        </div>
  
        <div className="d-flex flex-column justify-content-start align-items-start flex-md-row align-items-md-center m-0 p-0 mt-3">
          <div className="d-flex flex-row align-items-center flex-wrap">
            <div
              className={`m-0 m-0 mx-1 p-0 ${cs.skeleton}`}
              style={{ width: '3rem', height: "1rem" }}
            />
            <div
              className={`m-0 m-0 mx-1 p-0 ${cs.skeleton}`}
              style={{ width: "4rem", height: "1rem" }}
            />
            <div
              className={`m-0 m-0 mx-1 p-0 ${cs.skeleton}`}
              style={{ width: "4rem", height: "1rem" }}
            />
          </div>
  
          <div
            style={{ flex: 1 }}
            className="d-flex justify-content-end align-items-center align-self-end py-1"
          >
            <div
              className={`m-0 m-0 mx-1 p-0 ${cs.skeleton}`}
              style={{ width: "6rem", height: "1rem" }}
            />
            <div
              className={`m-0 m-0 mx-1 p-0 ${cs.skeleton}`}
              style={{ width: "6rem", height: "1.5rem" }}
            />
          </div>
        </div>
      </div>
    );
  };
  