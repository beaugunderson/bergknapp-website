async page => {
  // Routing disables the HTTP cache, including unchanged URLs for updated images.
  await page.route('**/*', route => route.continue());
  const results = [];
  for (const theme of ['light', 'dark']) {
    await page.emulateMedia({colorScheme: theme});
    await page.goto('http://127.0.0.1:8770/?check=' + Date.now());
    await page.addScriptTag({path: '/tmp/bergknapp-axe.min.js'});
    const content = await page.evaluate(() => {
      const text = document.body.innerText;
      const personal = [...document.querySelectorAll('a[href="https://beaugunderson.com"]')];
      return {
        removedCopyAbsent: !/the apps|native\. offline\. out of your way|little plant behind the name|malaga|say hello|beaugunderson\.com/i.test(text),
        productGitHubLinksOnly: [...document.querySelectorAll('a[href*="github.com"]')].map(a => a.href).sort().join(',') === 'https://github.com/beaugunderson/obliscence,https://github.com/beaugunderson/tracer',
        tracerScreenshot: document.querySelector('.tracer .app-visual img')?.getAttribute('src') === '/assets/tracer.webp',
        obliscenceTextOnly: !document.querySelector('.obliscence .app-visual') && /Claude Code and pi conversations/.test(document.querySelector('.obliscence .app-description')?.textContent),
        everyAppHasLogomark: [...document.querySelectorAll('.app')].every(card => card.querySelector('.app-heading img[alt=""]')),
        noTopNavigation: !document.querySelector('.masthead nav'),
        noImageCaptions: !document.querySelector('.app-visual figcaption'),
        appBackgrounds: [...document.querySelectorAll('.app')].every(el => {
          const background = getComputedStyle(el).backgroundColor;
          return background !== 'rgba(0, 0, 0, 0)' && background !== getComputedStyle(document.body).backgroundColor;
        }),
        noDividerRules: !document.querySelector('hr') && [...document.querySelectorAll('.masthead,.app,footer')].every(el => ['borderTopWidth','borderBottomWidth'].every(p => parseFloat(getComputedStyle(el)[p]) === 0)),
        galdraShowsChoices: document.querySelector('.galdra .app-visual img').getAttribute('src').includes('galdra-choices'),
        explanationOnly: !/why bergknapp|BÆRG-knahp|k pronounced|say it however/i.test(text) && document.querySelector('.about-copy').textContent.includes('Bergknapp is Norwegian for stonecrop'),
        oneNameLink: personal.length === 1 && personal[0].textContent === 'Beau Gunderson' && (text.match(/Beau Gunderson/g) || []).length === 1,
        darkBackground: getComputedStyle(document.body).backgroundColor.split(/[^\d]+/).filter(Boolean).slice(0,3).every(v => Number(v) < 50),
      };
    });
    if (Object.values(content).some(v => !v)) throw new Error(JSON.stringify({theme,content}));
    results.push({theme,content});
    for (const width of [320, 390, 650, 768, 900, 1280, 1440]) {
      await page.setViewportSize({width, height: 1000});
      await page.evaluate(() => document.querySelectorAll('img').forEach(img => img.loading = 'eager'));
      await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
      // A responsive picture may switch sources during resize, cancelling the previous decode.
      await page.waitForFunction(async () => {
        try { await Promise.all([...document.images].map(img => img.decode())); return true; }
        catch { return false; }
      }, null, {timeout:10000});
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        compactDesktop: innerWidth < 1280 || document.documentElement.scrollHeight <= 1850,
        currentKnapCapture: (() => {
          const image = document.querySelector('.knap picture img');
          return image.naturalWidth === (innerWidth <= 650 ? 796 : 1328);
        })(),
        tightPreviewSpacing: ['.knap', '.tuck'].every(selector => {
          const card = document.querySelector(selector), visual = card.querySelector('.app-visual');
          const image = visual.querySelector('img').getBoundingClientRect();
          const frame = visual.getBoundingClientRect();
          const heading = card.querySelector('.app-heading').getBoundingClientRect();
          return Math.abs(frame.height - image.height) < 1 && heading.top - image.bottom <= 14;
        }),
        compactToolCards: ['.tracer', '.obliscence'].every(selector => {
          const card = document.querySelector(selector), info = card.querySelector('.app-info');
          const visual = card.querySelector('.app-visual');
          const padding = parseFloat(getComputedStyle(card).paddingTop) + parseFloat(getComputedStyle(card).paddingBottom);
          return Math.abs(card.getBoundingClientRect().height - info.getBoundingClientRect().height - (visual?.getBoundingClientRect().height || 0) - padding) < 1;
        }),
        consistentColumnGaps: [...document.querySelectorAll('.app-column')].every(column => {
          const gap = parseFloat(getComputedStyle(column).rowGap);
          const cards = [...column.querySelectorAll('.app')];
          return cards.slice(1).every((card, i) => Math.abs(card.getBoundingClientRect().top - cards[i].getBoundingClientRect().bottom - gap) < 1);
        }),
        halfWidthCards: [...document.querySelectorAll('.app')].every(card => {
          const grid = document.querySelector('.grid');
          const expected = innerWidth <= 650 ? grid.getBoundingClientRect().width : (grid.getBoundingClientRect().width - parseFloat(getComputedStyle(grid).columnGap)) / 2;
          return Math.abs(card.getBoundingClientRect().width - expected) < 1;
        }),
        croppedTracerCapture: document.querySelector('.tracer .app-visual img').naturalHeight === 982,
        heroFitsDesktop: innerWidth < 1280 || ['#headline','.intro'].every(selector => {
          const el = document.querySelector(selector);
          return el.getBoundingClientRect().height < parseFloat(getComputedStyle(el).lineHeight) * 1.1;
        }),
        apps: [...document.querySelectorAll('a.app')].map(a => a.href),
        upcoming: [...document.querySelectorAll('article.upcoming')].map(card => ({name:card.querySelector('h2').textContent,comingSoon:card.textContent.includes('Coming soon'),nonInteractive:!card.querySelector('a,button,input')})),
        appCount: document.querySelectorAll('.app').length,
        missingSymbols: [...document.querySelectorAll('use')].filter(u => !document.querySelector(u.getAttribute('href'))).length,
        clippedPreviews: [...document.querySelectorAll('.app-visual img')].filter(img => {
          const i = img.getBoundingClientRect(), p = img.closest('.app-visual').getBoundingClientRect();
          const caption = img.closest('.app-visual').querySelector('figcaption');
          return i.left < p.left - 1 || i.right > p.right + 1 || i.bottom > (caption ? caption.getBoundingClientRect().top - 5 : p.bottom + 1);
        }).map(img => img.src),
      }));
      if (layout.overflow || !layout.consistentColumnGaps || !layout.halfWidthCards || !layout.croppedTracerCapture || !layout.compactDesktop || !layout.compactToolCards || !layout.tightPreviewSpacing || !layout.currentKnapCapture || !layout.heroFitsDesktop || layout.clippedPreviews.length || layout.missingSymbols || layout.apps.length !== 5 || layout.appCount !== 7 || layout.upcoming.length !== 2 || layout.upcoming.some(app => !app.comingSoon || !app.nonInteractive)) throw new Error(JSON.stringify({theme,width,layout}));
      results.push({theme,width,layout:'pass'});
      if ([390,1280].includes(width)) {
        const audit = await page.evaluate(async () => {
          const result = await axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','best-practice']}});
          return result.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)}));
        });
        results.push({theme,width,axe:audit});
        if (audit.length) throw new Error(JSON.stringify({theme,width,axe:audit}));
        await page.screenshot({path:`/tmp/bergknapp-check-${theme}-${width}.png`,fullPage:true});
      }
    }
  }
  await page.emulateMedia({colorScheme:'light',reducedMotion:'reduce'});
  await page.setViewportSize({width:1280,height:1000});
  await page.goto('http://127.0.0.1:8770/?check=' + Date.now());
  await page.keyboard.press('Tab');
  const focus = await page.evaluate(() => ({
    skip:document.activeElement.matches('.skip'),
    visible:document.activeElement.getBoundingClientRect().top >= 0,
    transition:getComputedStyle(document.querySelector('.app')).transitionDuration,
  }));
  if (!focus.skip || !focus.visible || focus.transition !== '0s') throw new Error(JSON.stringify(focus));
  return {results,keyboardAndReducedMotion:focus};
}
