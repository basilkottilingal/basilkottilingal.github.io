const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  const page = await browser.newPage();

  // Useful: large viewport to preserve responsive layout
  await page.setViewport({width: 1200, height: 800, deviceScaleFactor: 2});

  // Load page and wait for network + JS to finish
  await page.goto('file:///home/ucom/basil/basilkottilingal.github.io/pdf.html', {waitUntil: 'networkidle0', timeout: 60000});

  // Optionally wait extra time for animations or fonts
  // await page.waitForTimeout(500);

  await page.pdf({
    path: 'resume.pdf',
    printBackground: true,    // important to keep backgrounds
    preferCSSPageSize: true,  // uses @page size if provided
    format: 'A4',
    margin: {top: '10mm', bottom: '10mm', left: '10mm', right: '10mm'},
    scale: 1                   // adjust if things appear too small/large
  });

  await browser.close();
})();

