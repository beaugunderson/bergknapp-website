# bergknapp.works

The Bergknapp Softworks site: one static page linking to Knap, Spacebar, and Tuck, with coming-soon entries for Galdra and Narrowcast. No build step; Netlify publishes the repo root.

- `index.html` — the page, inline palette, and rosette SVG `<symbol>`.
- `styles.css` — the responsive gallery layout. Subtle spruce backgrounds group each app, without border outlines or horizontal separators. The Galdra grid track is content-sized so Tuck’s spanning card cannot inflate the gap above Narrowcast. Galdra and Narrowcast share the right column beside Tuck on wide screens; smaller screens follow the document order.
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
- **Spacebar:** a capture of the archive demo’s `.panel` in `../spacebar-website/index.html`, rendered in light mode at 2×. This is website demo artwork, not a native application screenshot; its alt text identifies it as a demo.
- **Tuck:** a capture of the illustrated `.desktop` demo in `../tuck/site/`, with the tray open. Captured at 720×311 CSS pixels, 2×, with the theme picker hidden. Its alt text identifies it as an illustrated demo. Neither preview has a visible caption.
- **Galdra:** an actual iPad simulator capture of the main session picker in `../singing-bowls/`. `galdra-choices.webp` crops the title and five complete choices with their descriptions (1668×2420 source; crop `24,80,856,958`, producing 832×878). This replaces the less-informative abstract room view. It is a cropped real screen, not reconstructed UI. Its app icon comes from the iOS asset catalog.
- **Narrowcast:** app icon from `../podcast-roulette/ios/Narrowcast/Assets.xcassets/`. The coming-soon card describes the taste-based podcast station and offline playback; no download or signup is available here yet.
- App icons come from the corresponding sites or app asset catalogs. Don’t draw substitute interfaces or expose personal app data in screenshots.

Galdra main-screen capture: locate its simulator data container, shut the device down, back up `Library/Preferences/com.beaugunderson.galdra.plist`, and set its `onboarded` boolean to true. Boot and launch without `--autoplay`. Restore the original plist with the simulator stopped afterward. Editing that file while simulator `cfprefsd` is running can be ignored; `-onboarded YES` alone did not bypass onboarding in the available build. Main-screen capture needs no motion permission.

Simulator UI gotchas: wait until the application menu exists after opening Simulator. A successful click on Rotate Left does not prove the app rotated: check captured pixel dimensions. A headlessly booted device may have no visible Simulator window.

For a session-room capture, `--autoplay 7` is available. An already-present Motion & Fitness alert can survive `simctl privacy ... grant motion` until the simulator restarts. Restore permissions/status-bar overrides and shut down devices you booted solely for captures.

## Check the page

With the preview server running:

```sh
curl -fsS https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js -o /tmp/bergknapp-axe.min.js
playwright-cli -s=checks open http://127.0.0.1:8770
playwright-cli -s=checks run-code --filename=scripts/check-site.js
playwright-cli -s=checks close
```

Checks cover seven viewport widths in light and dark mode, loaded/unclipped previews, app links, SVG references, keyboard focus, reduced motion, and axe accessibility audits at phone and desktop sizes. Review screenshots are written to `/tmp/bergknapp-check-*.png`. For individual card screenshots, scroll the card into view and await its image's `decode()` before capture; otherwise lazy loading can leave a blank preview in the screenshot.

## Deploy

Git pushes deploy automatically:

- `main` → production at https://bergknapp.works
- `design/app-previews` → https://design-app-previews--bergknapp-works.netlify.app (not production)

The connection uses a repository-scoped, **read-only** Netlify deploy key plus the GitHub webhook to `https://api.netlify.com/hooks/github`. Both are required: the hook triggers builds, and the key permits the build worker to clone. The original connection had a working hook but no key or GitHub App installation, causing **Host key verification failed**. Adding the key repaired the connection; Git-backed production and branch builds were verified September 10, 2026.

To make a manual static deploy instead:

```sh
bash scripts/deploy.sh                  # draft URL for review
bash scripts/deploy.sh --prod           # production, after approval
```

The manual script stages only public assets, excluding docs, scripts, and local files. Git builds publish the tracked repo root, as configured in `netlify.toml`. Both use the project’s headers. Keep local screenshots and research artifacts outside the repo. No DNS changes are needed.
