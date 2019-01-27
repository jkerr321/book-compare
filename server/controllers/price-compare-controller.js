const scrapePrices = require('../lib/page-scraper');
const getGoodReadBooks = require('../lib/good-reads-api');
const BookModel = require('../models/book-model');

const renderPriceCompareTable = async (req, res) => {
    try {
        const toReadList = await getGoodReadBooks();

        const prices = scrapePrices();
        const booksWithPrices = toReadList.map(async bookInfo => {
            try {
                const bookModel = new BookModel;
                bookModel.addBookInfo(bookInfo);
                const prices = await scrapePrices(bookInfo.isbn);
                // bookModel.addPriceInfo(prices);
    
                // console.log('==================');
                // console.log('bookModel', JSON.stringify(bookModel, 2, null));
                // console.log('==================');
                // return bookModel.model;
            } catch(err) {
                console.log(err);
            }
        })

        const result = JSON.stringify(toReadList);
        res.render('page', {result);
    } catch (err) {
        console.log(err);
    }
};

module.exports = renderPriceCompareTable;