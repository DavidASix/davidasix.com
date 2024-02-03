const fs = require("fs");
const path = require("path");
const packageJson = require("./package.json");

/**
 *
 * This script is run after package.json setup and prior to running the vite code.
 * The script modifies the firecms package in node_modules to remove some branding and features
 *
 **/

function replaceInFile(filePath, replacements) {
  let data = fs.readFileSync(filePath, "utf-8");

  for (const [strToReplace, replacementType] of Object.entries(replacements)) {
    let strReplacement = packageJson[replacementType];
    if (!strReplacement) {
      console.error(`⛔ Please fill in package.json value for ${replacementType}\n`);
      continue;
    } else if (data.includes(strToReplace)) {
      console.log(`✅ Replacing ${strToReplace} with ${strReplacement}`);
      data = data.replace(strToReplace, strReplacement);
    } else {
      console.log(`❗ Could not find string "${strToReplace}" in file.`);
    }
  }
  fs.writeFileSync(filePath, data, "utf8");
}

const targetFilePath = path.join(
  __dirname,
  "node_modules/firecms/dist/index.es.js"
);

replaceInFile(targetFilePath, {
  "https://firecms.co?utm_source=drawer": "home_url",
  "firecms.co": "name",
});
