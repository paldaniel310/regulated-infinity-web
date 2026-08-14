# regulated-infinity-web

Official website for **Regulated Infinity Labs**, deployed at `https://regulatedinfinity.com/` with Cloudflare Workers + Static Assets.

## Structure

The site has seven content routes per locale: home, PulseRail product overview, website privacy, accessibility, PulseRail privacy, support, and release status. English uses root paths; localized prefixes are `de`, `es`, `fr`, `hu`, `pt-br`, `ru`, and `zh-cn`.

## Language routing

A small Worker runs before unlocalized entry routes. On a first visit it uses Cloudflare's coarse request country metadata to choose a supported language where the mapping is reasonably clear. Hungary maps to Hungarian. If no supported choice is appropriate, English is the fallback. Selected multilingual countries may additionally use the browser `Accept-Language` header.

The visitor's explicit language choice always wins and is stored in the first-party `site_lang` cookie for up to one year. The website's own routing logic does not need the raw client IP and does not create its own IP-address log.

## Appearance

`assets/site.js` provides language and two-state light/dark controls. A manual theme choice is saved locally as `ril-theme`; before a manual choice, the operating-system color preference is used. CSS also respects reduced-motion and increased-contrast preferences where supported.

## Pre-publication safety

The site remains directly reachable but is in **pre-publication preview** mode while PulseRail is a release candidate. `_headers` sends `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` site-wide. This reduces search discovery; it is not access control.

## Deployment

Production deploys automatically from `main` through `.github/workflows/deploy.yml` using Cloudflare Wrangler.

- Worker: `regulated-infinity-web`
- Production: `regulatedinfinity.com`
- Fallback: `regulated-infinity-web.pdpushmail.workers.dev`
- Worker entry: `worker/index.js`
- Static assets: repository root, with technical files excluded by `.assetsignore`
- HTML handling: automatic trailing slash
- Missing pages: custom `404.html`

Required Actions secrets are `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

## Product status

Website claims are aligned to PulseRail `1.0.0-rc4` / versionCode `113`. PulseRail remains under active release-candidate integration and owner testing. The site deliberately distinguishes implemented design from unfinished release acceptance. Browser-based GitHub App onboarding is the RC4 target, while the current Setup Wizard still contains the historical fine-grained PAT-first product path; that cutover must not be described as complete.

## Privacy and accessibility

The site contains no advertising or marketing-analytics integrations. JavaScript is limited to first-party language/theme controls. The design uses semantic HTML, keyboard-visible focus, skip navigation, responsive layouts, dark mode and reduced-motion handling. The accessibility target is WCAG 2.2 Level AA; no independent certification is claimed yet.
