const fs = require('fs');
const scrapePrices = require('./lib/page-scraper');
const getGoodReadBooks = require('./lib/good-reads-api');
const { getCsvName, exportToCsv, deleteOldCsv } = require('./lib/csv-helpers');
// test data sets
const goodReadsTestResponse = require('./test/fixtures/good-reads-api-output');
const testBookDetailsWithPrices = require('./test/fixtures/book-objects-for-export');

const isScrapeWithinPreviousDay = (timestampNow, csvName) => {
	if (!csvName) {
		console.log('no existing csv file, scraping for fresh prices');
		return false;
	} else {
		const twentyFourHours = 86400000;
		const timestampPreviousString = csvName.split('.')[0];
		const timestampPrevious = new Date(parseInt(timestampPreviousString));

		if (timestampNow - timestampPrevious < twentyFourHours) {
			return true;
		} else {
			console.log('prices scraped over 24 hours ago. Scraping for fresh prices...');
			return false;
		}
	}
}

const init = (async () => {
	const timestampNow = new Date().valueOf();
	const existingCsv = getCsvName();

	try {
		const pricesScrapedInLast24Hours = isScrapeWithinPreviousDay(timestampNow, existingCsv);

		if (pricesScrapedInLast24Hours) {
			console.log('prices scraped in the last 24 hours - please use existing output.csv file');
		} else {
			const toReadList = await getGoodReadBooks(); // production values			
			// const toReadList = goodReadsTestResponse; // test values
			const bookPricesArray = await scrapePrices(toReadList);

			const bookDetailsWithPrices = bookPricesArray.map(amazonPriceObject => {
				let mergedBookData;
				toReadList.forEach(book => {
					if (book.title === amazonPriceObject.title) {
						mergedBookData = Object.assign(
							{}, 
							book, 
							{ prices: amazonPriceObject.prices },
							{ amazon_link: amazonPriceObject.amazon_link }
						);
					}
				});

				return mergedBookData;
			});

			const books = bookDetailsWithPrices // production values
			// const books = testBookDetailsWithPrices // test values

			exportToCsv(books, timestampNow);
			if (existingCsv) deleteOldCsv(existingCsv);

			console.log(`Prices exported to ${getCsvName()} csv in project root :)`)
		}
	} catch (err) {
		console.log(err);
	}
})();

module.exports = { init, isScrapeWithinPreviousDay };
