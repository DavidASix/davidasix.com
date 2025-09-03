const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadImage(imageUrl, filename, imagesDir) {
  try {
    if (!imageUrl) return null;
    
    // Make URL absolute if it's relative
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `https://api.davidasix.com${imageUrl}`;
    
    console.log(`  Downloading image: ${filename}`);
    const response = await axios.get(fullUrl, { responseType: 'stream' });
    const imagePath = path.join(imagesDir, filename);
    
    const writer = fs.createWriteStream(imagePath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filename));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`  ❌ Error downloading image ${filename}:`, error.message);
    return null;
  }
}

function extractImageFilename(url) {
  if (!url) return null;
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
}

function processContentBlocks(contentBlocks, downloadedImages, imagesPath = './images/') {
  if (!contentBlocks || !Array.isArray(contentBlocks)) return '';
  
  let markdown = '';
  
  contentBlocks.forEach(block => {
    if (block.Text && Array.isArray(block.Text)) {
      block.Text.forEach(textBlock => {
        // Handle different text block types
        const type = textBlock.type;
        
        switch (type) {
          case 'heading':
            const level = textBlock.level || 1;
            const headingPrefix = '#'.repeat(Math.min(level, 6));
            const headingText = extractTextFromChildren(textBlock.children);
            markdown += `${headingPrefix} ${headingText}\n\n`;
            break;
            
          case 'paragraph':
            const paragraphText = extractTextFromChildren(textBlock.children);
            if (paragraphText.trim()) {
              markdown += `${paragraphText}\n\n`;
            }
            break;
            
          case 'list':
            const listItems = textBlock.children || [];
            listItems.forEach((listItem, index) => {
              const itemText = extractTextFromChildren(listItem.children);
              if (textBlock.format === 'ordered') {
                markdown += `${index + 1}. ${itemText}\n`;
              } else {
                markdown += `- ${itemText}\n`;
              }
            });
            markdown += '\n';
            break;
            
          case 'quote':
            const quoteText = extractTextFromChildren(textBlock.children);
            markdown += `> ${quoteText}\n\n`;
            break;
            
          default:
            // Handle regular text blocks (paragraphs without explicit type)
            if (textBlock.children && Array.isArray(textBlock.children)) {
              const text = extractTextFromChildren(textBlock.children);
              if (text.trim()) {
                markdown += `${text}\n\n`;
              }
            }
        }
      });
    }
    
    // Handle images in content blocks
    if (block.Image && block.Image.data && block.Image.data.attributes) {
      const imageUrl = block.Image.data.attributes.url;
      const filename = extractImageFilename(imageUrl);
      if (filename && downloadedImages[imageUrl]) {
        markdown += `![Image](${imagesPath}${filename})\n\n`;
      }
    }
  });
  
  return markdown.trim();
}

function extractTextFromChildren(children) {
  if (!children || !Array.isArray(children)) return '';
  
  return children.map(child => {
    if (typeof child === 'string') return child;
    
    if (child.text !== undefined) {
      let text = child.text;
      
      // Apply text formatting
      if (child.bold) text = `**${text}**`;
      if (child.italic) text = `*${text}*`;
      if (child.underline) text = `<u>${text}</u>`; // HTML for underline in markdown
      if (child.strikethrough) text = `~~${text}~~`;
      if (child.code) text = `\`${text}\``;
      
      return text;
    }
    
    // Handle links
    if (child.type === 'link' && child.url) {
      const linkText = extractTextFromChildren(child.children);
      return `[${linkText}](${child.url})`;
    }
    
    // Handle nested children
    if (child.children) {
      return extractTextFromChildren(child.children);
    }
    
    return '';
  }).join('');
}

module.exports = {
  downloadImage,
  extractImageFilename,
  processContentBlocks,
  extractTextFromChildren
};