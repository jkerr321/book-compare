const scrapePrices = require('../lib/page-scraper');
const getGoodReadBooks = require('../lib/good-reads-api');
const BookModel = require('../models/book-model');
const testModel = require('../test/fixtures/complete-book-model-view');

const renderPriceCompareTable = async (req, res) => {
    try {
        // const toReadList = await getGoodReadBooks();

        // // for each toRead get price info and add to book object
        // const booksWithPrices = toReadList2.map(async bookInfo => {
        //     try {
        //         const bookModel = new BookModel;
        //         bookModel.addBookInfo(bookInfo);
        //         const isbn = bookModel.model.isbn ? bookModel.model.isbn : bookModel.model.isbn13;
        //         const prices = await scrapePrices({isbn, bookModel, testMode: testMode});
        //         // bookModel.addPriceInfo(prices); //TODO instead of inside lib?
        //         return bookModel.model;
        //     } catch(err) {
        //         console.log(err);
        //     }
        // })

        // const books = await Promise.all(booksWithPrices);
        const books = testModel;
        res.render('page', { books });
    } catch (err) {
        console.log(err);
    }
};

module.exports = renderPriceCompareTable;