# bergknapp.works

The Bergknapp Softworks site: one static page linking out to each app's own site (Knap, Spacebar, Tuck). No build step; Netlify publishes the repo root.

- `index.html` — the page, styles inline. The rosette mark is an inline SVG `<symbol>` so it picks up the light/dark palette.
- `favicon.svg` — the same mark with a `prefers-color-scheme` palette swap. Generated from the page by `scripts/sync-logo.py`. `icon-*.png`, `apple-touch-icon.png`, and `favicon.png` are light-palette rasters of it.
- `og.html` → `og.png` — the 1200×630 social card. Regenerate by serving the folder and screenshotting `og.html` at 1200×630 (`playwright-cli open`, `resize 1200 630`, `screenshot`).

Preview locally with `python3 -m http.server 8770 --bind 127.0.0.1` from the repo root.

## Regenerate the logo assets

The approved mark is the top-down **Blue spruce** rosette. Its geometry and both palettes live in `index.html`; outer, middle, and center leaves have non-overlapping brightness ranges.

With the preview server running, run from the repo root:

```sh
python3 scripts/sync-logo.py
playwright-cli -s=assets open http://127.0.0.1:8770
playwright-cli -s=assets run-code --filename=scripts/render-assets.js
sips -z 256 256 icon-512.png --out icon-256.png
sips -z 180 180 icon-512.png --out apple-touch-icon.png
sips -z 64 64 icon-512.png --out favicon.png
playwright-cli -s=assets close
```

Keep browser screenshots and exploration pages outside the publish root.

## App previews

`assets/` contains optimized, self-hosted WebP previews and the apps’ existing icons. There are no remote image requests, fonts, analytics, or client-side scripts.

- **Knap:** real app captures from `../knap-website/app-dark.png` and `app-dark-narrow.png`, resized to 1440px and 900px wide. Keep the narrow capture for phones.
- **Spacebar:** a capture of the archive demo’s `.panel` in `../spacebar-website/index.html`, rendered in light mode at 2×. This is website demo artwork, not a native application screenshot; the visible caption says so.
- **Tuck:** a capture of the illustrated `.desktop` demo in `../tuck/site/`, with the tray open. Captured at 720×311 CSS pixels, 2×, with the theme picker hidden. This is also explicitly labeled as a demo.
- App icons come from the corresponding sites. Don’t draw substitute interfaces or expose personal app data in screenshots.

## Check the page

With the preview server running:

```sh
curl -fsS https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js -o /tmp/bergknapp-axe.min.js
playwright-cli -s=checks open http://127.0.0.1:8770
playwright-cli -s=checks run-code --filename=scripts/check-site.js
playwright-cli -s=checks close
```

Checks cover seven viewport widths in light and dark mode, loaded/unclipped previews, app links, SVG references, keyboard focus, reduced motion, and axe accessibility audits at phone and desktop sizes. Review screenshots are written to `/tmp/bergknapp-check-*.png`.

## Deploy

GitHub `main` is connected to Netlify, but the integration currently fails while preparing the repository with **Host key verification failed** (observed September 10, 2026). Direct static deployments work. Until the repository connection is repaired, use:

```sh
bash scripts/deploy.sh                  # draft URL for review
bash scripts/deploy.sh --prod           # production, after approval
```

The script stages only public assets, excluding docs, scripts, and local files. It still uses the project’s `netlify.toml` headers. No DNS changes are needed.
