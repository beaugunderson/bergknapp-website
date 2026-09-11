# Contrast audit

Audited September 10, 2026, after adding subtle spruce backgrounds to the compact gallery. Ratios use computed foreground colors and composited ancestor backgrounds, measured in the browser.

| Element | Light OS preference | Dark OS preference |
| --- | ---: | ---: |
| Main headings / brand | 14.51:1 | 15.57:1 |
| Intro and footer text | 8.44:1 | 9.15:1 |
| App titles and taglines | 12.31:1 | 12.89:1 |
| App descriptions and metadata (lowest text contrast) | 7.16:1 | 7.58:1 |
| App links | 8.80:1 | 9.36:1 |
| Accent / focus indicator against page surfaces (lowest) | 8.80:1 | 9.36:1 |

All measured live text exceeds WCAG AAA's 7:1 normal-text threshold; the AA requirement is 4.5:1, or 3:1 for large text. Focus indicators exceed the 3:1 non-text threshold. Hovered app cards retain their text colors; the footer link becomes the higher-contrast accent color.

One improvement: the footer name link's underline previously used the faint divider color. It now uses `currentColor`, matching the text and making the link affordance clearer.

The rosette and app icons are decorative and paired with text. Subtle background fills group entries without card borders or horizontal dividers; text links and focus outlines identify interactive entries. Screenshot pixels are not included in these DOM text measurements: they illustrate the products and have descriptive alternative text, rather than supplying instructions needed to use this page. This is a contrast audit, not a claim of complete WCAG conformance.

The responsive/axe suite is in `scripts/check-site.js`. It checks both OS color preferences at 320, 390, 650, 768, 900, 1280, and 1440 pixels, with axe checks at 390 and 1280 pixels. The detailed ratio collector is `scripts/audit-contrast.js`; run it with the same local server and Playwright session.
