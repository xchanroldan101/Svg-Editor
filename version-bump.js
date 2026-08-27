import fs from 'fs';
import path from 'path';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = pkg.version;

const htmlPath = path.resolve('./index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

const updatedHtml = htmlContent.replace(
  /<meta name="description" content="[^"]*">/,
  `<meta name="description" content="This is the Svg Editor v${version}. https://github.io">`
);

fs.writeFileSync(htmlPath, updatedHtml, 'utf8');
console.log(`Successfully synced version v${version} to index.html`);
