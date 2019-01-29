const scrapePrices = require('../lib/page-scraper');
const getGoodReadBooks = require('../lib/good-reads-api');
const BookModel = require('../models/book-model');

const renderPriceCompareTable = async (req, res) => {
    try {
        const testMode = true //TODO, make this conditional?
        const toReadList = await getGoodReadBooks();

        // for each toRead get price info and add to book object
        const booksWithPrices = toReadList.map(async bookInfo => {
            try {
                const bookModel = new BookModel;
                bookModel.addBookInfo(bookInfo);
                const isbn = bookModel.model.isbn ? bookModel.model.isbn : bookModel.model.isbn13;
                const prices = await scrapePrices({isbn, bookModel, testMode: testMode});
                // bookModel.addPriceInfo(prices); //TODO instead of inside lib?
                return bookModel.model;
            } catch(err) {
                console.log(err);
            }
        })

        const result = JSON.stringify(await Promise.all(booksWithPrices));
        res.render('page', { result });
    } catch (err) {
        console.log(err);
    }
};

module.exports = renderPriceCompareTable;