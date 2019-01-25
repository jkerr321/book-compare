const rp = require('request-promise');
const cheerio = require('cheerio');
const testData = require('../test/fixtures/testData');

const pageScraper = async (bookModelPrices, testMode) => {
    //TODO untested with test mode - put some test data in and see if it works.
    try {
        let prices = {};

        if (testMode) {
            prices = testData;
        } else {
            //scrape prices from amazon
            const options = {
                uri: 'https://www.amazon.co.uk/gp/product/1781258635/ref=x_gr_w_bb?ie=UTF8&tag=x_gr_w_bb_uk-21&linkCode=as2&camp=1634&creative=6738',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
                }
            }
            const html = testMode? testData : await rp(options);
            const $ = cheerio.load(html);

            // isolate section of html containing prices and use regex to extract them
            const str = $('#twister > .top-level').each((i, el)=>{
                const strWithWhitespace = $(el).text(); //?? why console.log($(this).text()) not work? nothing is logged
                const cleanString = strWithWhitespace.replace(/\s+/g, ' ').trim()

                const formatRegex = /([a-z]+)/gmi;
                const webFormat = cleanString.match(formatRegex)[0];

                const priceRegex = /(—|[0-9.]+)/gmi;
                prices = cleanString.match(priceRegex);
            });
        }

        Object.keys(bookModelPrices).forEach(modelFormat => {
            if(webFormat.toLowerCase() === modelFormat) {
                bookModelPrices[modelFormat].amazon = prices[0],
                bookModelPrices[modelFormat].new_from = prices[1],
                bookModelPrices[modelFormat].used_from = prices[2]
            }
        });

        return bookModelPrices;

    } catch (err) {
        console.log(err);
    }
}

module.exports = pageScraper;
