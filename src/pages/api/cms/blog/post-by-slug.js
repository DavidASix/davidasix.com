import axios from "axios";

import c from "@/assets/constants";
//import limiter from "@/middleware/rateLimiter";
import reqType from "@/middleware/reqType";
import validateInput from "@/middleware/validateInput";

const { CMS_KEY } = process.env;

export default async function handler(req, res) {
  try {
    //await limiter(req);
    await reqType(req, "POST");
    const { slug } = req.body;
    await validateInput([{ name: "slug", value: slug, type: "string" }]);

    let post = null;
    const headers = { headers: { Authorization: `Bearer ${CMS_KEY}` } };

    const queries = [
      {
        query: "fields",
        values: {
          "[0]": "title",
          "[1]": "subtitle",
          "[2]": "slug",
          "[3]": "publish_date",
        },
      },
      {
        query: "filters",
        values: { "[slug][$eq]": slug },
      },
      {
        query: "populate",
        values: {
          "[header_image][fields][0]": "url",
          "[content_block][populate][Image][fields][0]": "url",
        },
      },
    ];

    const queryStr = queries
      .map((q) =>
        Object.keys(q.values)
          .map((key, j) => `${q.query}${key}=${q.values[key]}`)
          .join("&")
      )
      .join("&");

    post = await axios.get(
      `${c.cms}/api/dasix-blog-posts?${queryStr}`,
      headers
    );

    post = post?.data?.data[0]?.attributes;

    post = {
      ...post,
      header_image: post?.header_image?.data?.attributes?.url,
    };
    res.status(200).json(post);
  } catch (err) {
    console.log(err.data);
    res.status(err.code || 500).send(err.message || "Server Error Occured");
    return;
  }
}
