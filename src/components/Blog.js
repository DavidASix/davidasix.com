import Link from "next/link";
import c from "@/assets/constants";

export const BlogListItem = (props) => {
  let post = { ...props.post };
  // Minutes to read is calculated to display how long it might take to read,
  // similiar to Medium.
  let minutesToRead = 0;

  const wpm = 200;
  minutesToRead = Math.ceil(post.text.length / wpm);

  post.topics = post?.topics ? post.topics : [];

  return (
    <div className=" max-w-[1000px] mx-auto">
      <div className="frosted rounded-2xl p-4">
        <h2 className="text-start font-bold text-3xl">{post.title}</h2>

        <small className="text-sm italic">
          Published on {post.publish_date}
        </small>

        <div className="flex justify-start items-center">
          <Link
            href={`/blog/${post.slug}`}
            className="me-4 relative flex-1 max-h-[100px]"
          >
            <p className="text-md max-h-[100px] overflow-clip">
              {post.text}...
            </p>
            <div className="absolute bottom-1 right-0 w-1/2 h-min flex justify-end">
              <span className="py-2 px-2 badge badge-neutral italic text-xs">
                Read More
              </span>
            </div>
          </Link>
          <img
            src={`${c.cms}${post.header_image}`}
            className="rounded-2xl h-24 w-24 object-cover"
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="fs-small fst-italic me-2 text-nowrap">
            {minutesToRead} minute read
          </span>

          <Link
            href={`/blog/${post.slug}`}
            className="btn btn-primary w-24 h-6 min-h-min whitespace-nowrap rounded-full
                text-md"
          >
            Read Post
          </Link>
        </div>
      </div>
    </div>
  );
};

export const BlogSkeletonItem = () => {
  return (
    <div className=" max-w-[1000px] mx-auto">
      <div className="frosted rounded-2xl p-4">
        <div className="skeleton bg-white bg-opacity-10 w-1/2 h-8" />
        <div className="skeleton bg-white bg-opacity-10 w-1/5 h-4 my-2 ms-1" />

        <div className="flex justify-start items-center">
          <div className="flex-1 flex flex-col space-y-2 pe-4">
            <div className="skeleton bg-white bg-opacity-10 w-full h-6" />
            <div className="skeleton bg-white bg-opacity-10 w-full h-6" />
            <div className="skeleton bg-white bg-opacity-10 w-11/12 h-6" />
          </div>
          <div className="h-24 w-24 rounded-2xl skeleton bg-white bg-opacity-10" />
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="skeleton bg-white bg-opacity-10 w-32 h-6" />
          <div className="skeleton bg-white bg-opacity-10 w-24 h-6" />
        </div>
      </div>
    </div>
  );
};
