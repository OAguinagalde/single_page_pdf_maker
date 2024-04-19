// # How to run
// 
// Just install puppeteer and run the script
// 
//     npm install puppeteer@22.6.5
//     node main.js
// 
const puppeteer = require('puppeteer');

// NOTE I have no clue how anything works. I can only make this work ONLY if
// * the css @page width and height are set
// * the device width and height are set
// * the pdf height and width are set
// if any of those are not set, it all breaks.
// css makes no sense.

const out_file = "out.pdf"
const website = "https://oaguinagalde.github.io/";
// NOTE 1200 is the break-point between large and medium sizes on bootstrap version I use so it makes
// the pdf not have too much white space on the sides of the content.
// If not something you care, just make it 1920 or something else
const width = 1920;

async function main() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(website);
    // simulates my current device
    await page.emulate({
        name: 'custom',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        viewport: {
          width: 1920,
          height: 1024,
          deviceScaleFactor: 1,
          isMobile: false,
          hasTouch: false,
          isLandscape: false,
        },
    });
    // calculate the real height of the website
    const height = await page.evaluate(()=>{
        const body = document.body
        const html = document.documentElement;
        return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    });
    // the @page style describes how printing to pdf behaves.
    // make it so that when printing to pdf, each page is exactly the size of the website
    await page.addStyleTag({
        content: `
            @page {
                size: ${width}px ${height}px;
                margin: 0;
                padding: 0;
            }
            body {
                margin: 0;
            }
        `,
    });
    // make a pdf with pages exactly the size of the website
    await page.pdf({
        path: out_file,
        width: `${width}px`,
        height: `${height}px`,
        printBackground: true,
        margin: {
            top: '0px',
            bottom: '0px',
            left: '0px',
            right: '0px'
        },
        preferCSSPageSize: true,
    });
    browser.close();
}

main();
