const puppeteer = require("puppeteer");
exports.index = function(req, res){
    let data = ''
    fetchCookies().then((cookies) => {
        if (cookies) {
            console.log("Cookies:", cookies[0]);
            data = 'message';
        }
    });
    req.session.data = data
    console.log(req.session.data)
    return res.render('index');
};

exports.index = async function (req, res) {
    const cookies = await fetchCookies();

    if (cookies) {
        req.session.data = cookies[0]

    }

    return res.render('index');
};

async function fetchCookies() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        console.log("Open Dnevnik...");
        await page.goto("https://dnevnik2.petersburgedu.ru/login", {
            waitUntil: "networkidle2",
        });

        console.log("Wait for authorization...");

        await page.waitForFunction(
            () => document.cookie.includes("X-JWT-Token")
        );

        const cookies = await page.cookies();
        console.log("Success for take cookies");

        await browser.close();

        return cookies;
    } catch (error) {
        console.error("Error:", error.message);
        await browser.close();
    }
}