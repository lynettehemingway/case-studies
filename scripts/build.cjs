const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const output = path.join(root, 'dist');
fs.mkdirSync(output, { recursive: true });

// Only website files go into the published folder.
for (const entry of ['index.html', 'home page', 'bold page', 'editorial page', 'minimal page', 'shared', 'assets']) {
  fs.cpSync(path.join(root, entry), path.join(output, entry), { recursive: true });
}
fs.writeFileSync(path.join(output, '.nojekyll'), '');

// Keep earlier links to the flat HTML pages working.
for (const page of ['bold', 'editorial', 'minimal']) {
  const destination = `${page}%20page/`;
  fs.writeFileSync(path.join(output, `${page}.html`),
    `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=${destination}"><title>${page} case study</title></head><body><a href="${destination}">Open the ${page} page</a></body></html>\n`);
}
console.log('Website files copied to dist.');
