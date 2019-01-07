const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'https://www.amazon.co.uk/gp/product/1781258635/ref=x_gr_w_bb?ie=UTF8&tag=x_gr_w_bb_uk-21&linkCode=as2&camp=1634&creative=6738';

const pageScraper = async () => {
    try {
        const html = await rp(url);
        const $ = cheerio.load(html);
        let rowArr = [];
        const str = $('#twister > .top-level').each((i, el)=>{
            const strWithWhitespace = $(el).text(); //?? why console.log($(this).text()) not work? nothing is logged
            const cleanString = strWithWhitespace.replace(/\s+/g, ' ').trim()

            const titleRegex = /([A-Za-z ]+)/; //?? why did I have to add A-Z? How do I use the long regex without splitting it up?
            const priceRegex = /[^—£]+£?(—|[0-9.]+)/;

            const titleData = cleanString.match(titleRegex);
            const priceData = cleanString.match(priceRegex);
            // (/([a-z ]+) [^—£]+£?(—|[0-9.]+)(?: £?(—|[0-9.]+))?(?: £?(—|[0-9.]+))?/gmi);
            console.log('==================');
            console.log('priceData', priceData);
            console.log('==================');
            
        });
        
        console.log(rowArr);
    } catch (err) {
        console.log(err);
    }
}

module.exports = pageScraper;