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

		const pricesArray = await scrapePrices(bookModelArray);

		//!!is this confused? - passing bookModel in still causes side effects!
		const bookObjectsForRender = bookModelArray.map(book => {
			pricesArray.forEach(amazonPriceObject => {
				if (book.model.title === amazonPriceObject.title) {
					book.model.prices = amazonPriceObject.prices;
				}
			});
			return book;
		});

		console.log('==================');
		console.dir(bookObjectsForRender, { depth: 10 });
		console.log('==================');
		const books = testModel;
		res.render('page', {
			books
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports = renderPriceCompareTable;

/*
get subset of next 5 from goodReadsList
scrape prices for them
update subset to += 5
go again
*/
