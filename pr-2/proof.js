// Same flow against main (before, :3419) and this branch (after, :3418).
// Run with Playwright's page; writes PNGs and a WebM per version into OUT.
async (page) => {
  const OUT = "C:/Users/Lincoln/AppData/Local/Temp/claude/bd60e250825c06e8/b935138e-5df7-45bc-879d-e83d95562853/scratchpad/shots";
  const browser = page.context().browser();
  const runs = { before: "http://localhost:3419/", after: "http://localhost:3418/" };
  const report = {};
  const visibleCursors = (p) => p.evaluate(() => [...document.querySelectorAll(".site-cursor")].filter((c) => getComputedStyle(c).opacity !== "0").length);

  for (const [name, url] of Object.entries(runs)) {
    const r = (report[name] = {});
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: `${OUT}/video-${name}`, size: { width: 1440, height: 900 } } });
    const p = await ctx.newPage();
    await p.goto(url);
    await p.waitForTimeout(1500);
    await p.mouse.move(1380, 860);

    // 1. Scroll to the first section: agents build it.
    await p.mouse.wheel(0, 500);
    await p.waitForTimeout(900);
    await p.screenshot({ path: `${OUT}/${name}-1-first-section.png` });
    await p.waitForTimeout(3000);

    // 2. Scroll on to "Where I've worked": does a cursor still build it?
    await p.mouse.wheel(0, 1000);
    await p.waitForTimeout(450);
    r.cursorsInLaterSection = await visibleCursors(p);
    await p.screenshot({ path: `${OUT}/${name}-2-later-section.png` });
    await p.waitForTimeout(2500);

    // 3. Jump to the skills search and look 1s after it comes into view.
    await p.evaluate(() => {
      const h = [...document.querySelectorAll("h2")].find((e) => e.textContent.includes("Search my experience"));
      window.scrollTo({ top: h.getBoundingClientRect().top + scrollY - 60, behavior: "instant" });
    });
    await p.waitForTimeout(1000);
    r.searchResultsAfter1s = await p.locator(".grep-hit").count();
    await p.screenshot({ path: `${OUT}/${name}-3-skills-search.png` });
    await p.waitForTimeout(3000);

    // 4. Switch the search from 6 results to 1 and back: does the window snap or grow?
    const box = p.locator("#skill-search").locator("xpath=ancestor::div[contains(@class,'card')]");
    const heights = [];
    await p.getByRole("button", { name: "Mobile", exact: true }).click();
    for (let i = 0; i < 14; i++) {
      heights.push(Math.round((await box.boundingBox()).height));
      await p.waitForTimeout(60);
    }
    r.windowHeightsAfterClick = [...new Set(heights)].length;
    await p.getByRole("button", { name: "React", exact: true }).click();
    await p.waitForTimeout(1500);
    await ctx.close();

    // 5. Phone: touch screen, no fine pointer.
    const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
    const pp = await phone.newPage();
    await pp.goto(url);
    await pp.waitForTimeout(1500);
    await pp.evaluate(() => window.scrollTo({ top: 1050, behavior: "instant" }));
    await pp.waitForTimeout(700);
    r.cursorsOnPhone = await visibleCursors(pp);
    await pp.screenshot({ path: `${OUT}/${name}-4-phone.png` });
    await phone.close();
  }

  const fail = [];
  if (!(report.before.cursorsInLaterSection > 0)) fail.push("before: expected a cursor building the later section");
  if (report.after.cursorsInLaterSection !== 0) fail.push("after: expected no cursor in the later section");
  if (report.before.searchResultsAfter1s !== 0) fail.push("before: expected no results 1s after the search scrolls in");
  if (!(report.after.searchResultsAfter1s > 0)) fail.push("after: expected results within 1s");
  if (!(report.before.cursorsOnPhone > 0)) fail.push("before: expected cursors on a phone");
  if (report.after.cursorsOnPhone !== 0) fail.push("after: expected no cursors on a phone");
  if (fail.length) throw new Error(fail.join("; ") + " " + JSON.stringify(report));
  return report;
}
