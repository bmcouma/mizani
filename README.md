# Mizani website

A static, single-page introduction to Mizani, an early-stage business operations concept. The site describes a proposed product and customer validation programme; it does not represent a launched service.

## Requirements

- Node.js and npm
- Python for the local preview server

The only development dependency is TypeScript. Bootstrap 5.3 CSS and its bundled JavaScript are self-hosted in `static/vendor/bootstrap/`.

## Local development

```powershell
npm install
npm run build
python -m http.server 8000
```

Open `http://localhost:8000`. Keep the server running in the terminal while previewing. `npm run watch` recompiles TypeScript as files change.

Run the strict check without generating files:

```powershell
npm run typecheck
```

Run `npm run build` before deploying TypeScript changes. Generated ES modules and source maps are committed under `static/js/`, so a static host can serve the site without installing Node or running a build.

## Configuration

Edit `static/ts/config.ts`:

```ts
export const siteConfig = {
  productName: "Mizani",
  contactEmail: "mireribravin2019@gmail.com",
  websiteUrl: "https://bmcouma.github.io/mizani/",
  formEndpoint: "",
  privacyPolicyUrl: "#privacy-notice",
  analytics: {
    enabled: false,
    measurementId: ""
  }
} as const;
```

- **Contact:** Change `contactEmail` to the address intended for customer discovery. Contact links and the no-endpoint email draft use this value.
- **Domain/canonical URL:** The configured GitHub Pages project-site URL is `https://bmcouma.github.io/mizani/`. The compiled script updates the canonical and social metadata at runtime. The matching URLs in `index.html`, `robots.txt`, and `sitemap.xml` are also set for crawlers that do not execute JavaScript. Keep the `/mizani/` repository path unless a custom domain is deliberately configured.
- **Privacy:** `privacyPolicyUrl` defaults to the in-page privacy information at `#privacy-notice`. Before collecting data via a live endpoint, publish and link to a reviewed, complete privacy notice.
- **Form endpoint:** Set `formEndpoint` to the HTTPS URL for a backend that accepts the documented JSON payload. Leave it empty to keep online submission disabled and provide the visitor with an editable email draft instead. Do not put API keys or other secrets in frontend configuration.
- **Analytics:** No analytics are loaded. The configuration is intentionally disabled; do not enable tracking without a clear, reviewed privacy and consent approach.

### Form endpoint contract

The browser sends a JSON `POST` with these fields:

```json
{
  "name": "Example Name",
  "business_name": "Example Business",
  "business_type": "Wholesale or distribution",
  "phone": "Example phone number",
  "email": "Optional email",
  "order_channels": ["WhatsApp", "Phone calls"],
  "stock_tracking": "Optional description",
  "payment_reconciliation": "Optional description",
  "challenge": "Optional description",
  "message": "Optional message",
  "consent": true
}
```

Required form values and explicit consent are validated in the browser. The form includes a honeypot, a loading state, duplicate-submit prevention, success/error feedback, and a prefilled `mailto:` fallback. If a meta tag named `csrf-token` is supplied by a future server-rendered page, the request includes it in `X-CSRFToken`.

The browser code does not retain form values in local or session storage. An endpoint should validate and sanitize input server-side, protect against abuse, apply suitable access controls and retention rules, and return a non-2xx response when it cannot accept the request. Never request M-Pesa PINs, passwords, bank credentials, identity documents, payment messages, or similarly sensitive data in this form.

### Connecting a future Django backend

The current frontend is plain HTML with native ES modules. A Django integration can render the page from a template, replace static navigation/asset paths as needed, and set `siteConfig.formEndpoint` to a same-origin API route. The Django view should validate the documented payload, require consent, apply CSRF protection, and return an appropriate status code. Add a `<meta name="csrf-token" content="{{ csrf_token }}">` element in the rendered page so the frontend can send `X-CSRFToken`. Keep secrets and authoritative validation on the server. No Django backend is included here.

## GitHub Pages deployment

The `.github/workflows/pages.yml` workflow builds and deploys the static site to GitHub Pages on pushes to `main` and on manual workflow dispatch. It uses GitHub's Pages artifact deployment and copies only `index.html`, `robots.txt`, `sitemap.xml`, and the required CSS, image, JavaScript, and Bootstrap assets into the artifact. Development instructions, source TypeScript, local references, and dependencies are not part of the published artifact.

GitHub Pages is enabled with **GitHub Actions** as the build and deployment source. The workflow requires the repository's Actions permissions to allow Pages deployment. No custom domain is configured.

The live project site is `https://bmcouma.github.io/mizani/`. The page uses paths relative to the project root so assets work under `/mizani/`; canonical and social metadata, `robots.txt`, and the sitemap use the full project-site URL. The latest deployment was verified from the live URL and the GitHub Actions run.

## Other static deployment options

All deployment options serve the repository's static files. Install/build only when TypeScript has changed; the generated `static/js/` files are already included.

| Host | Build command | Publish/output directory | Notes |
|---|---|---|---|
| Netlify | `npm run build` | `.` | Set the custom domain in **Domain management** and add the DNS records Netlify provides. |
| Cloudflare Pages | `npm run build` | `.` | Choose **Direct Upload** or connect the repository; set the production domain under **Custom domains**. |
| Vercel | `npm run build` | `.` | Select **Other** as the framework preset and set the output directory to `.`; configure the domain in project settings. |
| GitHub Pages | `npm run typecheck && npm run build` in the workflow | Allowlisted `_site/` artifact | Configured in `.github/workflows/pages.yml`; Pages is enabled with GitHub Actions. |

For each host:

1. Connect the repository or upload the static files; do not configure a server-side runtime for the form unless one is intentionally provided.
2. Set the custom domain in the host dashboard and follow its DNS instructions. Wait for the host to report HTTPS is ready.
3. If using a custom domain, deliberately configure it with the host and update `websiteUrl`, canonical/Open Graph values in `index.html`, `robots.txt`, and `sitemap.xml`. No custom domain is currently configured.
4. Update contact and privacy settings in `static/ts/config.ts`.
5. If the form endpoint is enabled, configure its URL and deploy a backend that meets the payload contract; do not expose credentials in this repository.
6. Rebuild with `npm run build` after TypeScript changes and publish the resulting `static/js/` files with the rest of the site.

No deployment or publication is performed by this project.

## Content and evidence

The strategy document is the primary reference for product scope, market sizing assumptions, pricing and validation milestones. Market statistics and strategy projections are described with source/context caveats and are not represented as Mizani traction. Competitor descriptions are limited to category-level positioning and should be rechecked before a public launch. Founder background is drawn from the supplied CV and does not imply that Mizani has already been built.

## Project layout

```text
index.html
static/
  css/                 Brand tokens and page styling
  img/                 Favicon and social-sharing image
  js/                  Compiled ES modules and source maps
  ts/                  Strict TypeScript source modules
  vendor/bootstrap/    Self-hosted Bootstrap 5.3 assets
docs/
  deployment-and-validation.md
reference/             Supplied strategy and founder CV
```
