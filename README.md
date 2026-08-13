# regulated-infinity-web

Official static website for **Regulated Infinity Labs**, intended for deployment at `https://regulatedinfinity.com/` on Cloudflare Pages.

## Structure

- `/` — Regulated Infinity Labs home page
- `/pulserail/` — PulseRail product overview
- `/pulserail/privacy/` — pre-release privacy information
- `/pulserail/support/` — support landing page
- `/assets/logo.svg` — vectorized full Regulated Infinity Labs logo
- `/assets/mark.svg` — vectorized symbol / favicon
- `/_headers` — Cloudflare Pages security headers

## Deployment

The site has no build step and no runtime dependencies. In Cloudflare Pages, connect this repository and deploy the repository root as static assets.

Suggested settings:

- Production branch: `main`
- Framework preset: `None`
- Build command: leave empty
- Build output directory: `/` (repository root)

After the first successful deployment, add `regulatedinfinity.com` as the custom domain.

## Status

PulseRail privacy and support pages are intentionally marked as pre-release. Final production contact details and privacy disclosures must replace the provisional text before general public distribution.
