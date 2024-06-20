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
    const { page, itemsPerPage } = req.body;
    await validateInput([
      { name: "page", value: page, type: "number" },
      { name: "itemsPerPage", value: itemsPerPage, type: "number" },
    ]);

    let posts = [];
    let max_page = 0;
    const headers = { headers: { Authorization: `Bearer ${CMS_KEY}` } };
    const queries = [
      {
        query: "fields",
        values: {
          "[0]": "title",
          "[1]": "slug",
          "[2]": "publish_date",
        },
      },
      {
        query: "populate",
        values: {
          "[header_image][fields][0]": "url",
          "[content_block][populate]": "Text",
        },
      },
      { query: "sort", values: { "[0]": "publish_date:desc" } },
      {
        query: "pagination",
        values: {
          "[page]": page,
          "[pageSize]": itemsPerPage,
          "[withCount]": true,
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
    posts = await axios.get(
      `${c.cms}/api/dasix-blog-posts?${queryStr}`,
      headers
    );
    max_page = Math.ceil(
      posts?.data?.meta?.pagination?.total /
        posts?.data?.meta?.pagination?.pageSize
    );
    posts = posts?.data?.data;
    // Flatten out blogposts to usable objects
    posts = posts.map((f, i) => {
      const { title, slug, publish_date, header_image, content_block } =
        f.attributes;
      // Reduce all nested content_block text content into a single long string, then truncate it
      // This string will be displayed on front end.

      // content_block is an array of content blocks
      let text = content_block.reduce((allBlockText, cb) => {
        const textInBlock = cb?.["Text"].reduce((sum, textBlock) => {
          // text block is an array of types of text. A single sentence could have multiple
          // array elements as it has bold and italic text.
          const children = textBlock.children.reduce(
            (s, c) => `${s} ${c.text}`,
            ""
          );
          return `${sum} ${children}`;
        }, "");
        return `${allBlockText} ${textInBlock}`;
      }, "");

      return {
        title,
        slug,
        publish_date,
        header_image: header_image?.data?.attributes?.url,
        text: text.trim().slice(0, 300),
        wordCount: text.split(" ").length + 1,
      };
    });

    res.status(200).json({ max_page, posts });
  } catch (err) {
    console.log(err.data);
    res.status(err.code || 500).send(err.message || "Server Error Occured");
    return;
  }
}
