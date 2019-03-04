const scrapePrices = require('../lib/page-scraper');
const getGoodReadBooks = require('../lib/good-reads-api');

// test data sets
const goodReadsTestResponse = require('../test/fixtures/good-reads-api-output');
const testBookDetailsWithPrices = require('../test/fixtures/bookObjectsForRender');

const renderPriceCompareTable = async (req, res) => {
	try {
		// const toReadList = await getGoodReadBooks();
		const toReadList = goodReadsTestResponse;

		// for each toRead get price info and add to book object
		const bookDetailsArray = toReadList.map(bookInfo => {
			return {
				title: bookInfo.title,
				author: bookInfo.author,
				average_rating: bookInfo.average_rating,
				isbn: bookInfo.isbn,
				isbn13: bookInfo.isbn13
			};
		});

		//TODO only pass one book at a time into the scraper so that it's more decoupled?
		const bookPricesArray = await scrapePrices(bookDetailsArray);

		const bookDetailsWithPrices = bookPricesArray.map(amazonPriceObject => {
			let mergedBookData;
			bookDetailsArray.forEach(book => {
				if (book.title === amazonPriceObject.title) {
					mergedBookData = Object.assign({}, book, {
						prices: amazonPriceObject.prices
					});
				}
			});
			return mergedBookData;
		});

		const books = bookDetailsWithPrices;
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
