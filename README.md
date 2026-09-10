# bergknapp.works

The Bergknapp Softworks site: one static page linking out to each app's own site (Knap, Spacebar, Tuck). No build step; Netlify publishes the repo root.

- `index.html` — the page, styles inline. The rosette mark is an inline SVG `<symbol>` so it picks up the light/dark palette.
- `favicon.svg` — the same mark with fixed colors and a `prefers-color-scheme` swap. `icon-*.png`, `apple-touch-icon.png`, and `favicon.png` are rasters of it.
- `og.html` → `og.png` — the 1200×630 social card. Regenerate by serving the folder and screenshotting `og.html` at 1200×630 (`playwright-cli open`, `resize 1200 630`, `screenshot`).

Preview locally with `python3 -m http.server` from the repo root.
