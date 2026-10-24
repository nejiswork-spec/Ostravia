# Ostravia

A responsive landscape design and agricultural care website built with React, Vite, Tailwind CSS, GSAP, and Lenis. Production builds pre-render all five pages and hydrate their interactive controls in the browser.

## Development

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

No API keys or runtime secrets are required. Do not add secrets to browser code or `VITE_` environment variables.

## Release checks

```sh
npm run lint
npm run format:check
npm run build
npm test
npm audit
```

For browser tests on Linux/macOS, run `npx playwright install chromium`. Windows uses the installed Chrome by default. Set `CHROME_PATH` to override the executable.

For Lighthouse, start `npm run preview` in one terminal, then run `npm run lighthouse` in another. Reports are written to `artifacts/`, which is not committed or published. Lighthouse uses mobile throttling and desktop settings for every route. Its release thresholds are performance ≥90, accessibility 100, best practices ≥95, and SEO 100; results vary with hardware, hosting, and network conditions.

## Deployment

`npm run build` writes minified, pre-rendered HTML and hashed JavaScript/CSS to `dist/`, with Brotli/gzip sidecars and no source maps. `vercel.json` configures Vercel builds, page routes, caching, and security headers. The build uses Vercel's production origin for canonical URLs; set `SITE_URL` to override it when adding an owned domain. `_headers` and the local production server apply the same security policy on compatible hosting.

Deploy using `npx vercel --prod` after signing in, or import this GitHub repository in Vercel. Do not expose the source directory as a static web root. `.openai/hosting.json` retains an earlier, unpublished Sites registration and is excluded from Vercel uploads.

GitHub Actions repeats linting, formatting, dependency auditing, production build, browser tests, and Lighthouse. The source repository is separate from the static deployment; do not publish the source directory as a web root.

## Content and contact configuration

- Contact enquiries open a visitor’s email client. `hello@ostravia.com` is a requested placeholder, not a provisioned mailbox. Configure an owned mailbox before accepting real enquiries. No email is sent by this application’s server.
- Testimonials, project concepts, and portraits are illustrative. Replace them with approved client material before presenting them as verified case studies.
- Generated image prompts are retained under `docs/image-generation/` and excluded from the deployed directory.
- The footer uses the supplied Aivora logo.

## Security and accessibility

React escapes rendered text, forms use native validation, email URI values are encoded, external credit links use `rel="noreferrer"`, and dialogs support Escape, focus containment, and focus restoration. Motion respects reduced-motion preferences. The testimonial carousel pauses on hover/focus and supports manual navigation without the pause button requested to be removed.

Client-side code and public assets are inherently inspectable. Minification and omitted source maps reduce accidental exposure; they cannot prevent reverse engineering. Keep credentials, privileged operations, and proprietary server logic on a separately secured backend.
