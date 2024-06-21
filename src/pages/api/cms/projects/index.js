import axios from "axios";

import c from "@/assets/constants";
//import limiter from "@/middleware/rateLimiter";
import reqType from "@/middleware/reqType";

const { CMS_KEY } = process.env;

export default async function handler(req, res) {
  try {
    //await limiter(req);
    await reqType(req, "GET");
    const { page, itemsPerPage } = req.body;

    let projects = [];
    const headers = { headers: { Authorization: `Bearer ${CMS_KEY}` } };
    const queries = [
      {
        query: "fields",
        values: {
          "[0]": "title",
          "[1]": "slug",
          "[2]": "category",
          "[3]": "start_date",
          "[4]": "completed_date",
          "[5]": "active_development",
          "[6]": "short_description",
        },
      },
      {
        query: "populate",
        values: {
            "[logo][fields][0]": "url",
        },
      }
    ];

    const queryStr = queries
      .map((q) =>
        Object.keys(q.values)
          .map((key, j) => `${q.query}${key}=${q.values[key]}`)
          .join("&")
      )
      .join("&");
    projects = await axios.get(
      `${c.cms}/api/dasix-projects?${queryStr}`,
      headers
    );
    projects = projects?.data?.data;
    console.log(projects);
    // Flatten out blogposts to usable objects
    projects = projects.map((project, i) => ({
        ...project.attributes,
        logo: project?.attributes?.logo?.data?.attributes?.url,
    }));

    res.status(200).json(projects);
  } catch (err) {
    console.log(err.data);
    res.status(err.code || 500).send(err.message || "Server Error Occured");
    return;
  }
}
