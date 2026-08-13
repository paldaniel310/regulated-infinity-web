# regulated-infinity-web

Official static website for **Regulated Infinity Labs**, intended for deployment at `https://regulatedinfinity.com/` on Cloudflare Workers Static Assets.

## Structure

- `/` — Regulated Infinity Labs home page
- `/pulserail/` — PulseRail product overview
- `/pulserail/privacy/` — pre-release privacy information
- `/pulserail/support/` — support landing page
- `/assets/logo.svg` — vectorized full Regulated Infinity Labs logo
- `/assets/mark.svg` — vectorized symbol / favicon
- `/_headers` — static security headers

## Deployment

The site has no application build step and no runtime dependencies. Production deployment is handled by GitHub Actions using Cloudflare Wrangler and the repository's `wrangler.jsonc` configuration.

- Production branch: `main`
- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Cloudflare target: Workers Static Assets
- Wrangler asset directory: repository root

Required GitHub Actions repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

After the first successful deployment, `regulatedinfinity.com` can be attached as the custom domain in Cloudflare.

## Status

PulseRail privacy and support pages are intentionally marked as pre-release. Final production contact details and privacy disclosures must replace the provisional text before general public distribution.
