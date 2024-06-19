import axios from "axios";

import c from '@/assets/constants';
//import limiter from "@/middleware/rateLimiter";
import reqType from "@/middleware/reqType";
import validateInput from "@/middleware/validateInput";

const { CMS_KEY } = process.env;

export default async function handler(req, res) {
  try {
    //await limiter(req);
    await reqType(req, 'POST');
    const { page, itemsPerPage } = req.body;
    await validateInput([
      {name: 'page', value: page, type: 'number'},
      {name: 'itemsPerPage', value: itemsPerPage, type: 'number'},
    ])

    
  let formulas = [];
  let max_page = 0
  try {
    const headers = { headers: { Authorization: `Bearer ${CMS_KEY}` } };
    const queries = [
      { query: "fields", values: {0: "title", 1: "description", 2: "formula"} },
      { query: "pagination", values: {page: page, pageSize: itemsPerPage, withCount: true} }
    ];
    const queryStr = queries
      .map(q => Object.keys(q.values)
        .map((key, j) => 
          `${q.query}[${key}]=${q.values[key]}`).join("&"))
      .join("&");

    formulas = await axios.get(
      `${c.cms}/api/dasix-excel-formulas?${queryStr}`,
      headers
    );
    max_page = Math.ceil(formulas?.data?.meta?.pagination?.total / formulas?.data?.meta?.pagination?.pageSize)
    formulas = formulas?.data?.data;
    formulas = formulas.map((f, i) => f.attributes)
  } catch (err) {
    console.log(err);
  }

    res.status(200).json({max_page, formulas});
  } catch (err) {
    console.log(err)
    res.status(err.code).send(err.message);
    return;
  }
}
