const puppeteer = require("puppeteer");
require("dotenv").config()
exports.index = async function (req, res) {
    const cookies = await fetchCookies();

    if (cookies) {
        req.session.data = cookies[0]

    }

    return res.render('index');
};

async function fetchCookies() {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        executablePath:
        process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
        // executablePath: '/usr/bin/google-chrome',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--no-zygote',
            '--single-process'
        ]
    });
    const page = await browser.newPage();
    console.log("Opening browser...");
    console.log("Using executable path:", browser.session);

    try {
        console.log("Open Dnevnik...");
        await page.goto("https://www.google.com/", {
            // waitUntil: "networkidle2",
        });

        console.log("Wait for authorization...");

        // await page.waitForFunction(
        //     () => document.cookie.includes("X-JWT-Token"),
        // );

        const cookies = await page.cookies();
        console.log("Success for take cookies");
        console.log(cookies);

        await browser.close();

        return cookies;
    } catch (error) {
        console.error("Error:", error.message);
        await browser.close();
    }
}