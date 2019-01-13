const rp = require('request-promise');
const cheerio = require('cheerio');

const pageScraper = async () => {
    try {
        const url = 'https://www.amazon.co.uk/gp/product/1781258635/ref=x_gr_w_bb?ie=UTF8&tag=x_gr_w_bb_uk-21&linkCode=as2&camp=1634&creative=6738';
        const html = await rp(url);
        const $ = cheerio.load(html);

        // isolate section of html containing prices and use regex to extract them
        const str = $('#twister > .top-level').each((i, el)=>{
            const strWithWhitespace = $(el).text(); //?? why console.log($(this).text()) not work? nothing is logged
            const cleanString = strWithWhitespace.replace(/\s+/g, ' ').trim()

            const formatRegex = /([a-z]+)/gmi;
            const webFormat = cleanString.match(formatRegex)[0];
            
            const priceRegex = /(—|[0-9.]+)/gmi;
            const prices = cleanString.match(priceRegex);

            Object.keys(bookFormatsModel).forEach(modelFormat => {    
                if(webFormat.toLowerCase() === modelFormat) {
                    bookFormatsModel[modelFormat].amazon = prices[0],
                    bookFormatsModel[modelFormat].new_from = prices[1],
                    bookFormatsModel[modelFormat].used_from = prices[2]
                }
            })

        });

        return bookFormatsModel;

    } catch (err) {
        console.log(err);
    }
}

module.exports = pageScraper;