# Deployment and validation notes

## GitHub Pages deployment

- The project-site URL is `https://bmcouma.github.io/mizani/`; keep the `/mizani/` base path in canonical, Open Graph, Twitter, sitemap, and runtime configuration.
- `.github/workflows/pages.yml` builds the TypeScript and assembles an allowlisted `_site/` artifact containing only the public page, SEO files, and required static assets.
- Enable GitHub Pages with **GitHub Actions** as the deployment source in repository **Settings → Pages**. No custom domain is configured.
- The workflow triggers on pushes to `main` and can also be started manually.
- `reference/` and `AGENTS.md` are excluded from Git. The Pages artifact is assembled from an explicit allowlist, so project docs, tests, and source references are not published.

## Before launch

- The public contact address `mireribravin2019@gmail.com` is approved for the website and repository. It is displayed in the footer and used for the offline email fallback.
- Review the privacy information with an appropriate adviser before turning on a form backend. Define the actual purpose, access, retention, deletion, and contact process for submitted data.
- Review current WhatsApp Business Platform, Safaricom Daraja, and applicable data protection requirements. The site makes no claim that an integration or approval exists.
- Recheck statistics and competitor descriptions against their original sources before publication.
- Leave `formEndpoint` empty until the receiving backend is deployed and tested. Never place API secrets in browser code.

## Build and preview

```powershell
npm install
npm run typecheck
npm run build
python -m http.server 8000
```

Visit `http://localhost:8000`. Static deployment serves the checked-in output in `static/js/`; Node is not required on the production host.

## Form behavior

With an empty `formEndpoint`, valid form details remain in the page and are not stored or transmitted. The page offers an editable email draft; the visitor must review and send it themselves. The prefilled draft contains only the fields the visitor chose to provide.

With an endpoint, the page posts JSON using the documented field names, includes `X-CSRFToken` when a `csrf-token` meta tag exists, prevents duplicate submissions, and presents success or error feedback. A future endpoint must provide server-side validation, CSRF protection where applicable, rate limiting/abuse controls, safe handling of personal data, and an appropriate privacy notice.

## Responsive and interaction checks

Check the page at 360, 390, 768, 1024, and 1440 CSS pixels:

- Confirm no document-level horizontal overflow; the comparison table is intentionally scrollable within its responsive wrapper.
- Open/close the navigation by keyboard, select a link, and press Escape while open.
- Select each concept message and run the concept workflow. With reduced motion enabled, confirm the finished concept state appears without staged animation.
- Operate the FAQ with keyboard and inspect its expanded state.
- Submit an incomplete form; verify required fields, at least one order channel, and explicit consent are enforced.
- With no endpoint configured, verify that the page explicitly says no online submission occurred and presents the editable email fallback.
- In an isolated test configuration only, set a test endpoint and check loading, duplicate-submit prevention, successful response, non-2xx response, network error, and optional CSRF header. Do not use real customer data.
- Inspect title, description, canonical, Open Graph, Twitter card, favicon, robots, and sitemap values after replacing the domain.

## Privacy information draft

The current in-page notice explains that the form is frontend-only when no endpoint has been configured, does not persist to browser storage, and opens an email draft only after the visitor requests one. If an endpoint is configured, the visitor's submitted details are used for the customer discovery and validation contact they explicitly consented to. Do not activate that flow until the operator has documented the actual data controller, purposes, lawful basis, recipients/processors, retention period, security, rights/contact process, and any cross-border processing in a reviewed privacy notice.

## Quality assurance report

Complete this report after running the build and interaction checks. Record actual results and environment; do not claim Lighthouse scores unless a Lighthouse run was performed.

| Check | Result |
|---|---|
| `npm install` | Passed; 0 vulnerabilities reported |
| `npm run typecheck` | Passed |
| `npm run build` | Passed |
| Demo, reduced motion, navigation, FAQ, form fallback | Passed in the shared browser preview: mobile menu opens/closes, Escape restores focus, nav links close the menu, CTA navigates, demo completes, FAQ expands, invalid form is rejected, and offline fallback is explicit |
| Responsive viewport checks | Passed without document horizontal overflow at 360, 390, 768, 1024, and 1440 CSS pixels |
| SEO metadata / sitemap / robots | Project-site URLs verified as `https://bmcouma.github.io/mizani/`; required asset paths are relative to the project-site root |
| Lighthouse | Not run |

The mobile overflow found during deployment checks was caused by Bootstrap grid gutters extending beyond the narrow viewport. The small-screen container clipping rule in `static/css/sections.css` removes document-level horizontal overflow while retaining the existing layout. An initial browser run had stale cached CSS; the final checks used a cache-busted preview URL. The earlier failed automation attempts were test-harness issues (runner URL global unavailable and a click attempted on a collapsed, hidden menu link); the corrected interaction sequence passed.
