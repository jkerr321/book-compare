const scrapePrices = require('../lib/page-scraper');
const getGoodReadBooks = require('../lib/good-reads-api');

// test data sets
const goodReadsTestResponse = require('../test/fixtures/good-reads-api-output');
const testBookObjectsForRender = require('../test/fixtures/bookObjectsForRender');

const renderPriceCompareTable = async (req, res) => {
	try {
		// const toReadList = await getGoodReadBooks();
		const toReadList = goodReadsTestResponse;

		// for each toRead get price info and add to book object
		const bookInfoArray = toReadList.map(bookInfo => {
			return {
				title: bookInfo.title,
				author: bookInfo.author,
				average_rating: bookInfo.average_rating,
				isbn: bookInfo.isbn,
				isbn13: bookInfo.isbn13
			};
		});

		const pricesArray = await scrapePrices(bookInfoArray);

		const bookObjectsForRender = pricesArray.map(amazonPriceObject => {
			let mergedBookData;
			bookInfoArray.forEach(book => {
				if (book.title === amazonPriceObject.title) {
					mergedBookData = Object.assign({}, book, {
						prices: amazonPriceObject.prices
					});
				}
			});
			return mergedBookData;
		});

		const books = bookObjectsForRender;
		// const books = testBookObjectsForRender;
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
