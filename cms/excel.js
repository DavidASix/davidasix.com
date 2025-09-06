const axios = require("axios");
const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

// Read .env file manually
const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const envLines = envContent.split("\n");
const envVars = {};

envLines.forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [key, ...valueParts] = trimmed.split("=");
    if (key && valueParts.length > 0) {
      envVars[key] = valueParts.join("=");
    }
  }
});

const { CMS_KEY } = envVars;

async function scrapeExcelFormulas() {
  try {
    console.log("Starting Excel formulas scraper...");

    if (!CMS_KEY) {
      throw new Error("CMS_KEY not found in environment variables");
    }

    const headers = {
      headers: {
        Authorization: `Bearer ${CMS_KEY}`,
      },
    };

    let allFormulas = [];
    let page = 1;
    let maxPage = 1;
    const pageSize = 100; // Large page size to minimize requests

    // Keep fetching until we have all data
    while (page <= maxPage) {
      console.log(`Fetching page ${page}...`);

      const queries = [
        {
          query: "fields",
          values: { 0: "title", 1: "description", 2: "formula" },
        },
        {
          query: "pagination",
          values: { page: page, pageSize: pageSize, withCount: true },
        },
      ];

      const queryStr = queries
        .map((q) =>
          Object.keys(q.values)
            .map((key, j) => `${q.query}[${key}]=${q.values[key]}`)
            .join("&"),
        )
        .join("&");

      const response = await axios.get(
        `https://api.davidasix.com/api/dasix-excel-formulas?${queryStr}`,
        headers,
      );

      const formulas = response.data.data;
      const meta = response.data.meta;

      // Calculate max pages on first request
      if (page === 1) {
        maxPage = Math.ceil(meta.pagination.total / meta.pagination.pageSize);
        console.log(
          `Total formulas: ${meta.pagination.total}, Pages: ${maxPage}`,
        );
      }

      // Extract and flatten formula data
      const formulasFlattened = formulas.map((f) => f.attributes);
      allFormulas = allFormulas.concat(formulasFlattened);

      console.log(`Fetched ${formulas.length} formulas from page ${page}`);
      page++;
    }

    // Create YAML structure
    const yamlData = {
      excel_functions: allFormulas,
    };

    // Write to YAML file
    const yamlPath = path.join(__dirname, "excel.yml");
    const yamlString = yaml.dump(yamlData, {
      indent: 2,
      lineWidth: -1, // Prevent line wrapping
    });

    fs.writeFileSync(yamlPath, yamlString, "utf8");

    console.log(
      `✅ Successfully scraped ${allFormulas.length} Excel formulas to excel.yml`,
    );
  } catch (error) {
    console.error("❌ Error scraping Excel formulas:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    process.exit(1);
  }
}

// Run the scraper
scrapeExcelFormulas();
