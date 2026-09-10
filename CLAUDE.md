# bergknapp-website

Static one-page site for Bergknapp Softworks at https://bergknapp.works, hosted on Netlify (project `bergknapp-works`) and deployed from `main` of `beaugunderson/bergknapp-website`. `netlify.toml` publishes the repo root; no build.

- Keep the page a directory: one card per app pointing at that app's own site (knap.rocks, spacebar.tools, tuck.bar). Product detail lives on those sites, not here.
- Copy stays short and in Beau's voice. Add a card when an app has its own site; drop the card when it goes away.
- The mark is a stonecrop (sedum) rosette in profile on a rock. It lives twice: the inline `<symbol id="rosette">` in `index.html` (theme colors via CSS variables) and `favicon.svg` (fixed colors). Change both together, then regenerate the PNG icons with `sips` and `og.png` per the README.
- DNS is at Spaceship, not Netlify: `@ A 75.2.60.5`, `www CNAME bergknapp-works.netlify.app`, TTL 300. Manage records through the Spaceship API (`spaceship API key` in the emmylou 1Password vault); never move nameservers to Netlify (DNSSEC DS at Spaceship makes that SERVFAIL, see tuck's CLAUDE.md).
- Each app site links back here in its footer; when adding an app, add the reciprocal link on its site.
