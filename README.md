# A case study on case studies

Three ways to read the same CARTograph project: a newspaper, a black-and-white walkthrough, and a no-scroll reader.

## Run it locally

From this folder, run:

```sh
npm run web
```

Open http://localhost:3000. No install is needed. If PowerShell blocks npm, use `npm.cmd run web`. Refresh the browser after editing. Press Ctrl+C to stop the server.

## Where everything lives

```text
index.html                 Home page content and navigation
home page/                 Home page styling
bold page/                 Bold layout, styles, and interactions
editorial page/            Newspaper layout, reading controls, and print styles
minimal page/              No-scroll reader and screen viewer
shared/
  case-study.js            Project content used by all three editions
  styles.css               Shared navigation and base styles
assets/
  branding/                CARTograph logo
  screens/                 Original app screenshots
scripts/build.cjs          Copies website files into dist
server.cjs                 Local development server
tools/reference/           Earlier working references, not published
.github/workflows/         GitHub Pages publishing workflow
```

Each edition has an `index.html`, a CSS file, and a JavaScript file. Edit `shared/case-study.js` to change the project text in all three versions. Screen images are resolved relative to each edition's folder.

## Publish

```sh
npm run build
```

The `dist` folder contains only the website and is ignored by Git. Pushes to `main` run the Publish website workflow, which builds and deploys `dist` to GitHub Pages. Pages must be enabled with GitHub Actions as the source in repository settings.

Older links such as `bold.html` redirect to the new page folders in the published site and local server. Folder names with spaces are URL-encoded in navigation links.

## Page controls

- Editorial: article links, text-size controls, and print layout.
- Bold: seven-screen walkthrough, chapter navigation, and full-reading mode.
- Minimal: chapter picker, reading-page buttons, screen tabs, and enlarge dialog. Text is paginated to the viewport; mobile has Read/Screens buttons.

The survey is linked in every page's navigation. Devpost links open the original team project.
