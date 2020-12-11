const neatCsv = require('neat-csv');
const fs = require('fs');
const scrapePrices = require('./lib/page-scraper');
const { getCsvName, exportToCsv, deleteOldCsv } = require('./lib/csv-helpers');

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

const getFileContents = (filePath) => {
    return new Promise((resolve, reject) => {
		fs.readFile(filePath, async (err, data) => {
			if (err) {
				reject(err);
			}
			const fileContents = await neatCsv(data);
			resolve(fileContents);
		})
	});
};

const init = async () => {
	const timestampNow = new Date().valueOf();
	const existingCsv = getCsvName();

	try {
		const pricesScrapedInLast24Hours = isScrapeWithinPreviousDay(timestampNow, existingCsv);

		if (pricesScrapedInLast24Hours) {
			console.log('prices scraped in the last 24 hours - please use existing output.csv file (or delete that csv file if you\'d like to get new prices)');
		} else {
			const toReadList = await getFileContents(`${__dirname}/To_Read_Dec_2020.csv`);
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

			exportToCsv(books, timestampNow);
			if (existingCsv) deleteOldCsv(existingCsv);

			console.log(`** Success! Prices have been exported to ${getCsvName()} in the Tsundoku project root :) **`)
			console.log(`** The full file path for your book price csv file is: ${__dirname}/${getCsvName()} **`);
		}
	} catch (err) {
		console.log(err);
	}
};

module.exports = { init, isScrapeWithinPreviousDay };
