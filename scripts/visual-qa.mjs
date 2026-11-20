import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const baseUrl = process.env.VISUAL_QA_URL || "http://127.0.0.1:5174";
const outputDirectory = process.env.VISUAL_QA_OUTPUT || "/tmp/codebell-playwright";
const executablePath = process.env.PLAYWRIGHT_CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const routes = ["/", "/about", "/services", "/portfolio", "/faqs", "/contact", "/support"];
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const report = [];

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });

  for (const route of routes) {
    const page = await context.newPage();
    const runtimeErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });
    page.on("pageerror", (error) => runtimeErrors.push(error.message));

    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(route === "/portfolio" ? 2500 : 900);
    const revealSections = page.locator("[data-motion-reveal='section']");
    for (let revealIndex = 0; revealIndex < await revealSections.count(); revealIndex += 1) {
      await revealSections.nth(revealIndex).scrollIntoViewIfNeeded();
      await page.waitForTimeout(180);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(240);

    const metrics = await page.evaluate(() => {
      const overflowing = [...document.querySelectorAll("body *")]
        .filter((element) => {
          if (
            element.closest(
              "[inert], .cb-clients-marquee, .cb-honeypot, .cb-support-honeypot, .cb-site-motion-layer",
            ) || element.matches("canvas.cb-particle-network")
          ) return false;
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && (rect.right > window.innerWidth + 2 || rect.left < -2);
        })
        .slice(0, 12)
        .map((element) => ({
          selector: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${element.classList.length ? `.${[...element.classList].join(".")}` : ""}`,
          left: Math.round(element.getBoundingClientRect().left),
          right: Math.round(element.getBoundingClientRect().right),
          width: Math.round(element.getBoundingClientRect().width),
        }));

      const hero = document.querySelector("main > section:first-child");
      const heading = document.querySelector("main h1");
      const canvas = document.querySelector("canvas.cb-particle-network");
      return {
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        documentHeight: document.documentElement.scrollHeight,
        heroHeight: hero ? Math.round(hero.getBoundingClientRect().height) : null,
        headingBottom: heading ? Math.round(heading.getBoundingClientRect().bottom) : null,
        canvas: canvas ? {
          cssWidth: Math.round(canvas.getBoundingClientRect().width),
          cssHeight: Math.round(canvas.getBoundingClientRect().height),
          bitmapWidth: canvas.width,
          bitmapHeight: canvas.height,
        } : null,
        overflowing,
      };
    });

    const slug = route === "/" ? "home" : route.slice(1);
    const screenshot = `${outputDirectory}/${viewport.name}-${slug}.png`;
    await page.screenshot({ path: screenshot, fullPage: true, animations: "allow" });
    report.push({ viewport: viewport.name, route, status: response?.status(), screenshot, runtimeErrors, metrics });
    await page.close();
  }
  await context.close();
}

const interactionContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const interactionPage = await interactionContext.newPage();
await interactionPage.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
const firstCanvasFrame = await interactionPage.locator("canvas.cb-particle-network").evaluate((canvas) => canvas.toDataURL());
const firstSiteFieldFrame = await interactionPage.locator("canvas.cb-site-particle-field").evaluate((canvas) => canvas.toDataURL());
await interactionPage.waitForTimeout(450);
const secondCanvasFrame = await interactionPage.locator("canvas.cb-particle-network").evaluate((canvas) => canvas.toDataURL());
const secondSiteFieldFrame = await interactionPage.locator("canvas.cb-site-particle-field").evaluate((canvas) => canvas.toDataURL());
const progressBeforeScroll = await interactionPage.locator(".cb-site-scroll-progress").evaluate((element) => getComputedStyle(element).transform);
await interactionPage.locator(".cb-home-intro-section").scrollIntoViewIfNeeded();
await interactionPage.waitForTimeout(750);
const introOpacity = await interactionPage.locator(".cb-home-intro-section").evaluate((element) => Number(getComputedStyle(element).opacity));
const progressAfterScroll = await interactionPage.locator(".cb-site-scroll-progress").evaluate((element) => getComputedStyle(element).transform);
await interactionPage.evaluate(() => window.scrollTo(0, 0));
await interactionPage.locator(".cb-menu-toggle").click();
await interactionPage.locator(".cb-mobile-sidebar.open").waitFor();
const mobileMenuOpened = await interactionPage.locator(".cb-mobile-sidebar.open").count() === 1;
const menuFocusIsContained = await interactionPage.evaluate(() => document.activeElement?.closest(".cb-mobile-sidebar") !== null);
await interactionPage.screenshot({ path: `${outputDirectory}/mobile-menu-open.png`, fullPage: false });
await interactionPage.locator(".cb-close-btn").click();
await interactionPage.goto(`${baseUrl}/faqs`, { waitUntil: "domcontentloaded" });
await interactionPage.locator(".cb-faq-question").first().click();
const faqExpanded = await interactionPage.locator(".cb-faq-question").first().getAttribute("aria-expanded");
report.push({
  interactionChecks: {
    particleAnimationChangesFrames: firstCanvasFrame !== secondCanvasFrame,
    siteFieldAnimationChangesFrames: firstSiteFieldFrame !== secondSiteFieldFrame,
    scrollRevealCompleted: introOpacity > 0.98,
    scrollProgressChanged: progressBeforeScroll !== progressAfterScroll,
    mobileMenuOpened,
    mobileMenuFocusWasContained: menuFocusIsContained,
    faqExpanded: faqExpanded === "true",
  },
});
await interactionContext.close();

await browser.close();
console.log(JSON.stringify(report, null, 2));
