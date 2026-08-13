# regulated-infinity-web

Official static website for **Regulated Infinity Labs**, deployed at `https://regulatedinfinity.com/` using Cloudflare Workers Static Assets.

## Public structure

- `/` — Regulated Infinity Labs home page
- `/pulserail/` — PulseRail product overview
- `/pulserail/privacy/` — PulseRail pre-release privacy information
- `/pulserail/support/` — PulseRail support and diagnostic guidance
- `/pulserail/terms/` — provisional release-status page reserved for final distribution information
- `/privacy/` — website data-use information
- `/accessibility/` — accessibility statement
- `/404.html` — custom not-found page
- `/assets/logo.svg` — vectorized full Regulated Infinity Labs logo
- `/assets/mark.svg` — vectorized symbol / favicon
- `/_headers` — static response security headers

## Deployment

The site has no application build step and no browser-side runtime dependency. Production deployment is handled by GitHub Actions using Cloudflare Wrangler and `wrangler.jsonc`.

- Production branch: `main`
- Workflow: `.github/workflows/deploy.yml`
- Cloudflare target: Workers Static Assets
- Production domain: `regulatedinfinity.com`
- Preview/fallback domain: `regulated-infinity-web.pdpushmail.workers.dev`
- Static asset directory: repository root
- HTML routing: automatic trailing-slash handling
- Missing pages: custom `404.html`

Required GitHub Actions repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Product status

Website copy is currently aligned to PulseRail `1.0.0-rc4`, which remains under active release-candidate development and owner testing. Privacy, support and release-status copy is deliberately marked as pre-release where production integration or final distribution details are not yet fixed.

## Accessibility and privacy

The public site uses semantic HTML, keyboard-visible focus, a skip link, responsive CSS and reduced-motion handling. It does not depend on client-side JavaScript. The site source currently contains no advertising or analytics scripts.
