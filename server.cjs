const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const port = Number(process.env.PORT || 3000);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method not allowed');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400);
    response.end('Invalid URL');
    return;
  }

  const legacyPage = /^\/(bold|editorial|minimal)\.html$/.exec(pathname);
  if (legacyPage) {
    response.writeHead(302, { Location: `/${legacyPage[1]}%20page/` });
    response.end();
    return;
  }
  const filename = path.resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
  const relativePath = path.relative(root, filename);
  const extension = path.extname(filename).toLowerCase();

  // Serve only website assets inside this folder.
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath) || !contentTypes[extension]) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  fs.readFile(filename, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Type': contentTypes[extension],
      'Cache-Control': 'no-store'
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  });
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the other server or set PORT to another number.`);
  } else {
    console.error(error.message);
  }
  process.exitCode = 1;
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Case studies: http://localhost:${port}`);
  console.log('Press Ctrl+C to stop. Refresh the browser after editing a file.');
});
