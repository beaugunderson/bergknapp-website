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
