const axios = require("axios");
const fs = require("fs");
const path = require("path");
const {
  downloadImage,
  extractImageFilename,
  processContentBlocks,
} = require("./utils");

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

async function scrapeProjects() {
  try {
    console.log("Starting Projects scraper...");

    if (!CMS_KEY) {
      throw new Error("CMS_KEY not found in environment variables");
    }

    const headers = {
      headers: {
        Authorization: `Bearer ${CMS_KEY}`,
      },
    };

    console.log("📄 Fetching all projects...");

    // First, get all projects with basic info (like the projects index endpoint)
    const allProjectsQueries = [
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
      },
    ];

    const allProjectsQueryStr = allProjectsQueries
      .map((q) =>
        Object.keys(q.values)
          .map((key, j) => `${q.query}${key}=${q.values[key]}`)
          .join("&"),
      )
      .join("&");

    const allProjectsResponse = await axios.get(
      `https://api.davidasix.com/api/dasix-projects?${allProjectsQueryStr}`,
      headers,
    );

    const allProjects = allProjectsResponse.data.data.map((project) => ({
      ...project.attributes,
      logo: project?.attributes?.logo?.data?.attributes?.url,
    }));

    // Sort projects like the original endpoint does
    allProjects.sort(
      (a, b) =>
        new Date(b.completed_date || "2100-01-01") -
        new Date(a.completed_date || "2100-01-01"),
    );

    console.log(`📋 Found ${allProjects.length} projects:`);
    allProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (${project.slug})`);
    });

    console.log("\n🔄 Processing individual projects...");

    for (let i = 0; i < allProjects.length; i++) {
      const projectSummary = allProjects[i];
      console.log(
        `\n[${i + 1}/${allProjects.length}] Processing: ${projectSummary.title}`,
      );

      // Create project directory
      const projectDir = path.join(__dirname, "projects", projectSummary.slug);
      const imagesDir = path.join(projectDir, "images");
      fs.mkdirSync(projectDir, { recursive: true });
      fs.mkdirSync(imagesDir, { recursive: true });

      // Get full project details (by-slug endpoint)
      const fullProjectQueries = [
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
            "[7]": "google_play_url",
            "[8]": "apple_store_url",
            "[9]": "github_url",
            "[10]": "project_url",
            "[11]": "privacy_policy",
            "[12]": "data_delete",
          },
        },
        {
          query: "filters",
          values: { "[slug][$eq]": projectSummary.slug },
        },
        {
          query: "populate",
          values: {
            "[features][fields][0]": "string",
            "[technologies][fields][0]": "string",
            "[logo][fields][0]": "url",
            "[screenshots][fields][0]": "url",
            "[description_blocks][populate][Image][fields][0]": "url",
          },
        },
      ];

      const fullProjectQueryStr = fullProjectQueries
        .map((q) =>
          Object.keys(q.values)
            .map((key, j) => `${q.query}${key}=${q.values[key]}`)
            .join("&"),
        )
        .join("&");

      const projectResponse = await axios.get(
        `https://api.davidasix.com/api/dasix-projects?${fullProjectQueryStr}`,
        headers,
      );

      const project = projectResponse.data.data[0]?.attributes;
      if (!project) {
        console.log(
          `  ❌ Could not fetch full details for ${projectSummary.slug}`,
        );
        continue;
      }

      // Download images
      const downloadedImages = {};

      // Download logo
      if (project.logo?.data?.attributes?.url) {
        const logoUrl = project.logo.data.attributes.url;
        const logoFilename = extractImageFilename(logoUrl);
        if (logoFilename) {
          const result = await downloadImage(logoUrl, logoFilename, imagesDir);
          if (result) {
            downloadedImages[logoUrl] = logoFilename;
          }
        }
      }

      // Download screenshots
      if (
        project.screenshots?.data &&
        Array.isArray(project.screenshots.data)
      ) {
        for (const screenshot of project.screenshots.data) {
          if (screenshot.attributes?.url) {
            const screenshotUrl = screenshot.attributes.url;
            const screenshotFilename = extractImageFilename(screenshotUrl);
            if (screenshotFilename) {
              const result = await downloadImage(
                screenshotUrl,
                screenshotFilename,
                imagesDir,
              );
              if (result) {
                downloadedImages[screenshotUrl] = screenshotFilename;
              }
            }
          }
        }
      }

      // Download images from description blocks
      if (
        project.description_blocks &&
        Array.isArray(project.description_blocks)
      ) {
        for (const block of project.description_blocks) {
          if (block.Image && block.Image.data && block.Image.data.attributes) {
            const imageUrl = block.Image.data.attributes.url;
            const filename = extractImageFilename(imageUrl);
            if (filename) {
              const result = await downloadImage(imageUrl, filename, imagesDir);
              if (result) {
                downloadedImages[imageUrl] = filename;
              }
            }
          }
        }
      }

      // Generate main project markdown
      let markdownContent = "";

      // Front matter
      markdownContent += "---\n";
      markdownContent += `title: "${project.title}"\n`;
      markdownContent += `slug: "${project.slug}"\n`;
      markdownContent += `category: "${project.category || ""}"\n`;
      markdownContent += `original_link: "https://davidasix.com/projects/${project.slug}"\n`;
      if (project.start_date)
        markdownContent += `start_date: "${project.start_date}"\n`;
      if (project.completed_date)
        markdownContent += `completed_date: "${project.completed_date}"\n`;
      markdownContent += `active_development: ${project.active_development || false}\n`;
      if (project.short_description)
        markdownContent += `short_description: "${project.short_description}"\n`;
      if (project.google_play_url)
        markdownContent += `google_play_url: "${project.google_play_url}"\n`;
      if (project.apple_store_url)
        markdownContent += `apple_store_url: "${project.apple_store_url}"\n`;
      if (project.github_url)
        markdownContent += `github_url: "${project.github_url}"\n`;
      if (project.project_url)
        markdownContent += `project_url: "${project.project_url}"\n`;
      markdownContent += `has_privacy_policy: ${!!project.privacy_policy}\n`;
      markdownContent += `has_data_delete: ${!!project.data_delete}\n`;

      // Logo in front matter
      if (project.logo?.data?.attributes?.url) {
        const logoUrl = project.logo.data.attributes.url;
        const logoFilename = extractImageFilename(logoUrl);
        if (logoFilename && downloadedImages[logoUrl]) {
          markdownContent += `logo: "./images/${logoFilename}"\n`;
        }
      }

      // Screenshots in front matter
      if (
        project.screenshots?.data &&
        Array.isArray(project.screenshots.data) &&
        project.screenshots.data.length > 0
      ) {
        markdownContent += "screenshots:\n";
        project.screenshots.data.forEach((screenshot) => {
          const screenshotUrl = screenshot.attributes?.url;
          const screenshotFilename = extractImageFilename(screenshotUrl);
          if (screenshotFilename && downloadedImages[screenshotUrl]) {
            markdownContent += `  - "./images/${screenshotFilename}"\n`;
          }
        });
      }

      // Features array
      if (project.features && Array.isArray(project.features)) {
        markdownContent += "features:\n";
        project.features.forEach((feature) => {
          markdownContent += `  - "${feature.string}"\n`;
        });
      }

      // Technologies array
      if (project.technologies && Array.isArray(project.technologies)) {
        markdownContent += "technologies:\n";
        project.technologies.forEach((tech) => {
          markdownContent += `  - "${tech.string}"\n`;
        });
      }

      markdownContent += "---\n\n";

      // Main content - ONLY description blocks
      if (
        project.description_blocks &&
        Array.isArray(project.description_blocks)
      ) {
        const contentMarkdown = processContentBlocks(
          project.description_blocks,
          downloadedImages,
          "./images/",
        );
        markdownContent += contentMarkdown;
      }

      // Write main project file
      const projectFilePath = path.join(projectDir, `${project.slug}.md`);
      fs.writeFileSync(projectFilePath, markdownContent, "utf8");
      console.log(`  ✅ Created: ${project.slug}.md`);

      // Create privacy policy file if it exists
      if (project.privacy_policy) {
        console.log(`  📄 Creating privacy policy...`);

        let privacyContent = "";

        // Process privacy policy content blocks - NO front matter
        if (project.privacy_policy && Array.isArray(project.privacy_policy)) {
          const privacyMarkdown = processContentBlocks(
            project.privacy_policy,
            downloadedImages,
            "./images/",
          );
          privacyContent += privacyMarkdown;
        } else if (typeof project.privacy_policy === "string") {
          privacyContent += project.privacy_policy;
        }

        const privacyFilePath = path.join(projectDir, "privacy-policy.md");
        fs.writeFileSync(privacyFilePath, privacyContent, "utf8");
        console.log(`  ✅ Created: privacy-policy.md`);
      }

      // Create data delete file if it exists
      if (project.data_delete) {
        console.log(`  📄 Creating data delete policy...`);

        let dataDeleteContent = "";

        // Process data delete content blocks - NO front matter
        if (project.data_delete && Array.isArray(project.data_delete)) {
          const dataDeleteMarkdown = processContentBlocks(
            project.data_delete,
            downloadedImages,
            "./images/",
          );
          dataDeleteContent += dataDeleteMarkdown;
        } else if (typeof project.data_delete === "string") {
          dataDeleteContent += project.data_delete;
        }

        const dataDeleteFilePath = path.join(projectDir, "data-delete.md");
        fs.writeFileSync(dataDeleteFilePath, dataDeleteContent, "utf8");
        console.log(`  ✅ Created: data-delete.md`);
      }
    }

    console.log(`\n🎉 Successfully processed ${allProjects.length} projects!`);
    console.log(`📁 Project folders created in: cms/projects/`);
    console.log(`🖼️  Images saved in respective project images folders`);
  } catch (error) {
    console.error("❌ Error scraping projects:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    process.exit(1);
  }
}

// Run the scraper
scrapeProjects();
