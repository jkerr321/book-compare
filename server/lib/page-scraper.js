const puppeteer = require('puppeteer');
const testData = require('../test/fixtures/testData');

//THIS WORKS!
const pageScraper = async () => {
    const url = `https://www.amazon.co.uk/gp/product/1781258635`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(url);

   const result  = await page.$$eval('#twister > .top-level', element => {
        const htmlArray = element.map(el => el.innerText);
        return htmlArray.map(el => {
            const cleanString = el.replace(/\s+/g, ' ').trim()

            // extract book format (kindle, hardcover etc)
            const formatRegex = /([a-z]+)/gmi;
            const amazonFormat = cleanString.match(formatRegex)[0];

            // extract prices
            const priceRegex = /(—|[0-9.]+)/gmi;
            prices = cleanString.match(priceRegex);

            const amazonPriceObject = {
                [amazonFormat]: {
                    amazon: prices[0],
                    new_from: prices[1],
                    used_from: prices[2]
                }
            }
            return amazonPriceObject;
        })
    });

    console.log('result', result);

};

pageScraper();

// const pageScraper = async ({isbn, bookModel, testMode}) => {
//     try {
//         if (isbn) {
//             // get Amazon Standard Identification Number - the book’s ISBN in its older, 10-digit version
//             const aisn = isbn.substring(isbn.length - 10);

//             //scrape prices from amazon (or testData if in test mode)
//             const url = `https://www.amazon.co.uk/gp/product/${aisn}`;
//             const browser = await puppeteer.launch({ headless: true });
//             const page = await browser.newPage();
//             await page.setViewport({ width: 1920, height: 926 });
//             await page.goto(url);

//             //TODO put test mode back in for html
//             await page.$$eval('#twister > .top-level', element => {
//                 const each = element.map(el => {
//                     const strWithWhitespace = el.outerHTML;
//                     const cleanString = strWithWhitespace.replace(/\s+/g, ' ').trim()

//                     // extract book format (kindle, hardcover etc)
//                     const formatRegex = /([a-z]+)/gmi;
//                     const amazonFormat = cleanString.match(formatRegex)[0];

//                     // extract prices
//                     const priceRegex = /(—|[0-9.]+)/gmi;
//                     prices = cleanString.match(priceRegex);

//                     const amazonPriceObject = {
//                         [amazonFormat]: {
//                             amazon: prices[0],
//                             new_from: prices[1],
//                             used_from: prices[2]
//                         }
//                     }

//                     Object.keys(bookModel.model.prices).forEach(bookModelFormat => {
//                         if (amazonFormat.toLowerCase() === bookModelFormat) {
//                             bookModel.model.prices[bookModelFormat] = amazonPriceObject;
//                         }
//                     });
//                 });
//             });

//             return bookModel;
//         } //TODO handle else situation
//     } catch (err) {
//         console.log(err);
//     }
// }

// module.exports = pageScraper;