const scrapePrices = require('../lib/page-scraper');
const getGoodReadBooks = require('../lib/good-reads-api');

// test data sets
const goodReadsTestResponse = require('../test/fixtures/good-reads-api-output');
const testBooksForRender = require('../test/fixtures/bookObjectsForRender');

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

		// TODO should probably do this in the pageScraper.formatData function
		// check all formats are present, if not add a dummy value for them - this is so the client side table can be sorted
		const validatedBooksForRender = testBooksForRender.map(book => {
			// const validatedBooksForRender = booksForRender.map(book => {
			let validatedBook = book;
			const requiredFormats = ['kindle', 'paperback', 'hardcover'];
			requiredFormats.forEach(format => {
				if (!Object.keys(book.prices).includes(format)) {
					validatedBook.prices[format] = {
						amazon: '—',
						new_from: '—',
						used_from: '—'
					};
				}
			});
			return validatedBook;
		});

		const books = validatedBooksForRender;
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
