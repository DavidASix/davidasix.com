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
    let project = null;
    const headers = { headers: { Authorization: `Bearer ${CMS_KEY}` } };

    const queries = [
      {
        query: "fields",
        values: {
          "[0]": "title",
          "[1]": "slug",
          "[2]": "short_description",
          "[3]": "privacy_policy",
          "[4]": "data_delete",
        },
      },
      {
        query: "filters",
        values: { "[slug][$eq]": slug },
      },
      {
        query: "populate",
        values: {
          "[logo][fields][0]": "url",
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

    project = await axios.get(
      `${c.cms}/api/dasix-projects?${queryStr}`,
      headers
    );
    project = project?.data?.data;
    if (!project?.length) {
      throw { code: 404, message: "project not found" };
    }

    project = project[0]?.attributes;

    // Flatten out nested components
    project = {
      ...project,
      logo: project?.logo?.data?.attributes?.url,
      data_delete: !!project?.data_delete,
    };

    res.status(200).json(project);
  } catch (err) {
    console.log(err.data);
    res.status(err.code || 500).send(err.message || "Server Error Occured");
    return;
  }
}
