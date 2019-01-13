const pageScraper = require('../lib/page-scraper');
const getGoodReadBooks = require('../lib/good-reads-api');
const BookModel = require('../models/book-model');

const renderPriceCompareTable = async (req, res) => {
    try {
        const bookModel = new BookModel;
        const toReadList = await getGoodReadBooks();
        // for each to read get price info and add to book object



        const result = JSON.stringify(toReadList);
        res.render('page', { result });
    } catch (err) {
        console.log(err);
    }
};

module.exports = renderPriceCompareTable;