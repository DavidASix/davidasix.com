const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { downloadImage, extractImageFilename, processContentBlocks } = require('./utils');

// Read .env file manually
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
const envVars = {};

envLines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key] = valueParts.join('=');
    }
  }
});

const { CMS_KEY } = envVars;

async function scrapeBlogPosts() {
  try {
    console.log('Starting Blog posts scraper...');
    
    if (!CMS_KEY) {
      throw new Error('CMS_KEY not found in environment variables');
    }

    const headers = { 
      headers: { 
        Authorization: `Bearer ${CMS_KEY}` 
      } 
    };

    let allPosts = [];
    let page = 1;
    let maxPage = 1;
    const pageSize = 100;

    // First, get all blog post summaries
    console.log('📄 Fetching all blog post summaries...');
    while (page <= maxPage) {
      console.log(`Fetching page ${page}...`);
      
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
            "[pageSize]": pageSize,
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

      const response = await axios.get(
        `https://api.davidasix.com/api/dasix-blog-posts?${queryStr}`,
        headers
      );

      const posts = response.data.data;
      const meta = response.data.meta;
      
      if (page === 1) {
        maxPage = Math.ceil(meta.pagination.total / meta.pagination.pageSize);
        console.log(`Total posts: ${meta.pagination.total}, Pages: ${maxPage}`);
      }

      const postsFlattened = posts.map(post => ({
        ...post.attributes,
        header_image: post.attributes.header_image?.data?.attributes?.url
      }));
      
      allPosts = allPosts.concat(postsFlattened);
      console.log(`Fetched ${posts.length} posts from page ${page}`);
      page++;
    }

    console.log(`\n📋 Found ${allPosts.length} blog posts:`);
    allPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} (${post.slug})`);
    });

    console.log('\n🔄 Processing individual blog posts...');
    
    for (let i = 0; i < allPosts.length; i++) {
      const postSummary = allPosts[i];
      console.log(`\n[${i + 1}/${allPosts.length}] Processing: ${postSummary.title}`);
      
      // Get full post details
      const postQueries = [
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
          values: { "[slug][$eq]": postSummary.slug },
        },
        {
          query: "populate",
          values: {
            "[header_image][fields][0]": "url",
            "[content_block][populate][Image][fields][0]": "url",
          },
        },
      ];

      const postQueryStr = postQueries
        .map((q) =>
          Object.keys(q.values)
            .map((key, j) => `${q.query}${key}=${q.values[key]}`)
            .join("&")
        )
        .join("&");

      const postResponse = await axios.get(
        `https://api.davidasix.com/api/dasix-blog-posts?${postQueryStr}`,
        headers
      );

      const post = postResponse.data.data[0]?.attributes;
      if (!post) {
        console.log(`  ❌ Could not fetch full details for ${postSummary.slug}`);
        continue;
      }

      // Download images
      const downloadedImages = {};
      const imagesDir = path.join(__dirname, 'blog', 'images');
      
      // Download header image
      if (post.header_image?.data?.attributes?.url) {
        const headerImageUrl = post.header_image.data.attributes.url;
        const headerFilename = extractImageFilename(headerImageUrl);
        if (headerFilename) {
          const result = await downloadImage(headerImageUrl, headerFilename, imagesDir);
          if (result) {
            downloadedImages[headerImageUrl] = headerFilename;
          }
        }
      }

      // Download images from content blocks
      if (post.content_block && Array.isArray(post.content_block)) {
        for (const block of post.content_block) {
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

      // Generate markdown content
      let markdownContent = '';
      
      // Front matter
      markdownContent += '---\n';
      markdownContent += `title: "${post.title}"\n`;
      markdownContent += `original_link: "https://davidasix.com/blog/${post.slug}"\n`;
      markdownContent += `publish_date: "${post.publish_date}"\n`;
      if (post.subtitle) {
        markdownContent += `subtitle: "${post.subtitle}"\n`;
      }
      markdownContent += '---\n\n';
      
      // Main title
      markdownContent += `# ${post.title}\n\n`;
      
      // Subtitle if exists
      if (post.subtitle) {
        markdownContent += `## ${post.subtitle}\n\n`;
      }
      
      // Header image
      if (post.header_image?.data?.attributes?.url) {
        const headerImageUrl = post.header_image.data.attributes.url;
        const headerFilename = extractImageFilename(headerImageUrl);
        if (headerFilename && downloadedImages[headerImageUrl]) {
          markdownContent += `![Header image](./images/${headerFilename})\n\n`;
        }
      }
      
      // Content blocks
      if (post.content_block && Array.isArray(post.content_block)) {
        const contentMarkdown = processContentBlocks(post.content_block, downloadedImages);
        markdownContent += contentMarkdown;
      }
      
      // Write markdown file
      const blogFilePath = path.join(__dirname, 'blog', `${post.slug}.md`);
      fs.writeFileSync(blogFilePath, markdownContent, 'utf8');
      
      console.log(`  ✅ Created: ${post.slug}.md`);
    }

    console.log(`\n🎉 Successfully processed ${allPosts.length} blog posts!`);
    console.log(`📁 Files created in: cms/blog/`);
    console.log(`🖼️  Images saved in: cms/blog/images/`);
    
  } catch (error) {
    console.error('❌ Error scraping blog posts:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the scraper
scrapeBlogPosts();