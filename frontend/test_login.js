import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  let browser;
  try {
    // Launch headless Chromium
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    let logs = [];
    page.on('console', msg => logs.push(`[Console] ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', error => logs.push(`[PageError]: ${error.message}`));

    console.log("Navigating to login page...");
    // Localhost port 5174 is used by Vite
    await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle' });

    console.log("Filling in credentials...");
    await page.fill('input[type="email"]', 'aditya1@gmail.com');
    await page.fill('input[type="password"]', '1234');

    console.log("Clicking login...");
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ url: 'http://localhost:5174/movies', timeout: 5000 })
    ]);

    console.log("Successfully navigated to /movies after login!");

    // Capture screenshot
    await page.screenshot({ path: 'login_success.png' });
    console.log("Screenshot saved to login_success.png");

    // Print out the extracted data from local storage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const role = await page.evaluate(() => localStorage.getItem('role'));
    const userName = await page.evaluate(() => localStorage.getItem('userName'));
    
    console.log("\n--- EXAMINING LOCAL STORAGE ---");
    console.log(`Token received: ${token ? token.substring(0, 20) + "..." : "null"}`);
    console.log(`Role: ${role}`);
    console.log(`UserName: ${userName}`);

    if (logs.length > 0) {
      console.log("\n--- BROWSER LOGS ---");
      console.log(logs.join('\n'));
    }

    console.log("\nTEST PASSED: End to end login functions correctly.");

  } catch (error) {
    console.error("Test failed due to an error:");
    console.error(error);
  } finally {
    if (browser) await browser.close();
  }
})();
