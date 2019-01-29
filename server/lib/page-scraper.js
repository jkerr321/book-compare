const rp = require('request-promise');
const cheerio = require('cheerio');
const testData = require('../test/fixtures/testData');

const pageScraper = async ({isbn, bookModel, testMode}) => {
    try {
        if (isbn) {
            // get Amazon Standard Identification Number - the book’s ISBN in its older, 10-digit version
            const aisn = isbn.substring(isbn.length - 10);

            //scrape prices from amazon (or testData if in test mode)
            const options = {
                //TODO use isbn here
                uri: `https://www.amazon.co.uk/gp/product/${aisn}`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
                }
            }
            const html = testMode ? testData : await rp(options);
            const $ = cheerio.load(html);

            // isolate section of html containing prices and use regex to extract them
            $('#twister > .top-level').map((i, el)=>{
                const strWithWhitespace = $(el).text(); //?? why console.log($(this).text()) not work? nothing is logged
                const cleanString = strWithWhitespace.replace(/\s+/g, ' ').trim()

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

                Object.keys(bookModel.model.prices).forEach(bookModelFormat => {
                    if (amazonFormat.toLowerCase() === bookModelFormat) {
                        bookModel.model.prices[bookModelFormat] = amazonPriceObject;
                    }
                });
            });

            return bookModel;
        } 
        //TODO handle else situation

    } catch (err) {
        console.log(err);
    }
}

module.exports = pageScraper;
