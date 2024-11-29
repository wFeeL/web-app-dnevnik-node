// const puppeteer = require("puppeteer");
// require("dotenv").config()
// exports.index = async function (req, res) {
//     const cookies = await fetchCookies();
//
//     if (cookies) {
//         req.session.data = cookies[0]
//
//     }
//
//     return res.render('index');
// };
//
// async function fetchCookies() {
//     const browser = await puppeteer.launch({
//         headless: true,
//         defaultViewport: null,
//         executablePath:
//         process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
        // executablePath: '/usr/bin/google-chrome',
        // args: [
        //     '--no-sandbox',
        //     '--disable-setuid-sandbox',
        //     '--disable-dev-shm-usage',
        //     '--disable-accelerated-2d-canvas',
        //     '--disable-gpu',
        //     '--no-zygote',
        //     // '--single-process'
        // ]
//     });
//     const page = await browser.newPage();
//     console.log("Opening browser...");
//     console.log("Using executable path:", browser.session);
//
//     try {
//         console.log("Open Dnevnik...");
//         await page.goto("https://www.google.com/", {
//             // waitUntil: "networkidle2",
//         });
//
//         console.log("Wait for authorization...");
//
//         // await page.waitForFunction(
//         //     () => document.cookie.includes("X-JWT-Token"),
//         // );
//
//         const cookies = await page.cookies();
//         console.log("Success for take cookies");
//         console.log(cookies);
//
//         await browser.close();
//
//         return cookies;
//     } catch (error) {
//         console.error("Error:", error.message);
//         await browser.close();
//     }
// }
const puppeteer = require('puppeteer');
require('dotenv').config();
exports.index = async function (req, res) {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        executablePath:
            process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--single-process',
            '--no-zygote',
        ]
    });
    const page = await browser.newPage();

    await page.goto('https://developer.chrome.com/');
    console.log("go to the site")
    await page.setViewport({width: 1080, height: 1024});

// Type into search box.
    await page.locator('.devsite-search-field').fill('automate beyond recorder');

// Wait and click on first result.
    await page.locator('.devsite-result-item-link').click();

// Locate the full title with a unique string.
    const textSelector = await page
        .locator('text/Customize and automate')
        .waitHandle();
    const fullTitle = await textSelector?.evaluate(el => el.textContent);

// Print the full title.
    console.log('The title of this blog post is "%s".', fullTitle);
    await browser.close();
    return res.send(fullTitle);
};