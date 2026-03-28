import { chromium } from 'playwright';

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    let logs = [];
    page.on('console', msg => logs.push(`[Console] ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', error => logs.push(`[PageError]: ${error.message}`));

    console.log("Navigating to login page...");
    await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle' });

    console.log("Filling in credentials...");
    await page.fill('input[type="email"]', 'aditya1@gmail.com');
    await page.fill('input[type="password"]', '1234');

    console.log("Clicking login...");
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:5174/movies');

    console.log("Logged in! Checking movies...");
    await page.waitForSelector('text=Book Ticket', { state: 'visible', timeout: 5000 });
    
    // Intercept the booking API call
    page.on('request', request => {
        if(request.url().includes('/api/bookings') && request.method() === 'POST') {
            console.log("----- [INTERCEPTED POST /api/bookings] -----");
            console.log("Payload:", request.postData());
        }
    });
    
    page.on('response', async response => {
        if(response.url().includes('/api/bookings') && response.request().method() === 'POST') {
            console.log("----- [RESPONSE /api/bookings] -----");
            console.log("Status:", response.status());
            const text = await response.text();
            console.log("Response Body:", text);
        }
    });

    console.log("Clicking on first 'Book Ticket' button...");
    const bookButtons = await page.$$('text=Book Ticket');
    if(bookButtons.length > 0) {
        await bookButtons[0].click();
        await page.waitForLoadState('networkidle');
        
        console.log("In Movie Details. Waiting for shows...");
        const shows = await page.$$('.cursor-pointer.border-2');
        if(shows.length > 0) {
            console.log("Clicking first available show...");
            await shows[0].click();
            
            console.log("Waiting for seats to load...");
            await page.waitForTimeout(1000); // Give seats time to load and render
            
            console.log("Looking for available seats...");
            // The available seats are buttons that DO NOT have the class 'cursor-not-allowed'
            const availableSeats = await page.$$('button:not([disabled])');
            
            if(availableSeats.length >= 2) {
               console.log(`Found ${availableSeats.length} interactive seats! Clicking the first two...`);
               await availableSeats[0].click();
               await availableSeats[1].click();
               
               console.log("Clicking Confirm & Pay...");
               await page.click('text=Confirm & Pay');
               
               console.log("Waiting for network requests to settle...");
               await page.waitForTimeout(3000); // Wait 3 seconds to capture api response
               
               // Check if the success message appeared
               const success = await page.$('text=Booking confirmed!');
               if(success) {
                   console.log("TEST PASSED: Booking success message found in UI!");
               } else {
                   console.log("TEST FAILED: Booking success message NOT found.");
               }
            } else {
               console.log("Not enough available seats to book!");
            }
        } else {
            console.log("No shows found for this movie.");
        }
    } else {
        console.log("No movies found or no Book Ticket button.");
    }

    if (logs.length > 0) {
      console.log("\n--- BROWSER CONSOLE LOGS ---");
      console.log(logs.join('\n'));
    }

  } catch (error) {
    console.error("Test execution error:", error);
  } finally {
    if (browser) await browser.close();
  }
})();
