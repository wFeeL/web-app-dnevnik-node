const puppeteer = require("puppeteer");

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
        executablePath: '/usr/bin/google-chrome',
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
        await page.goto("https://ya.ru", {
            waitUntil: "networkidle2",
        });

        console.log("Wait for authorization...");

        await page.waitForFunction(
            () => document.cookie.includes("X-JWT-Token"),
            { timeout: 30000 }
        );

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