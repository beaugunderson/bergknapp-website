async page => {
  await page.emulateMedia({ colorScheme: 'light' });
  // Avoid an irrelevant favicon.ico request from the standalone SVG document.
  await page.route('**/favicon.ico', route => route.fulfill({ status: 204 }));
  await page.setViewportSize({ width: 512, height: 512 });
  await page.goto('http://127.0.0.1:8770/favicon.svg');
  await page.screenshot({ path: 'icon-512.png', omitBackground: true });
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.goto('http://127.0.0.1:8770/og.html');
  await page.screenshot({ path: 'og.png' });
}
