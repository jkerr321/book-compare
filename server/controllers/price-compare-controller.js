const scrapePrices = require('../lib/page-scraper');
const getGoodReadBooks = require('../lib/good-reads-api');
const BookModel = require('../models/book-model');
const goodReadsTestResponse = require('../test/fixtures/good-reads-api-output');
const testModel = require('../test/fixtures/complete-book-model-view');

const renderPriceCompareTable = async (req, res) => {
	try {
		// const toReadList = await getGoodReadBooks();
		const toReadList = goodReadsTestResponse;

		// for each toRead get price info and add to book object
		const bookModelArray = toReadList.map(bookInfo => {
			const bookModel = new BookModel();
			bookModel.addBookInfo(bookInfo);
			return bookModel;
		});

		// const books = await scrapePrices(bookModelArray);
		// console.log('==================');
		// console.dir(books, { depth: 10 });
		// console.log('==================');

		const books = testModel;
		res.render('page', { books });
	} catch (err) {
		console.log(err);
	}
};

module.exports = renderPriceCompareTable;
