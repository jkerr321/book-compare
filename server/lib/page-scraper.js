const puppeteer = require('puppeteer');

const pageScraper = async bookModelArray => {
	const browser = await puppeteer.launch();

	const resolvedBookModels = await Promise.all(
		bookModelArray.map(async bookModel => {
			const isbn = bookModel.model.isbn
				? bookModel.model.isbn
				: bookModel.model.isbn13;

			try {
				if (isbn) {
					// get Amazon Standard Identification Number - the book’s ISBN in its older, 10-digit version
					const aisn = isbn.substring(isbn.length - 10);

					//scrape prices from amazon using puppeteer (or testData if in test mode)
					const url = `https://www.amazon.co.uk/gp/product/${aisn}`;
					const page = await browser.newPage();
					await page.setViewport({ width: 1920, height: 926 });
					// await page.goto(url, {
					//   timeout: 0,
					//   waitUntil: "networkidle2"
					// });
					await page.goto(url);

					// array of each row of amazon book format price table
					const htmlArray = await page.$$eval(
						'#twister > .top-level',
						element => element.map(el => el.innerText)
					);
					await page.close();

					htmlArray.forEach(el => {
						//remove whitespace
						const cleanString = el.replace(/\s+/g, ' ').trim();

						// extract book format (kindle, hardcover etc)
						const formatRegex = /([a-z]+)/gim;
						const amazonFormat = cleanString.match(formatRegex)[0];

						// extract prices
						const priceRegex = /(—|[0-9.]+)/gim;
						prices = cleanString.match(priceRegex);

						const amazonPrices = {
							amazon: prices[0],
							new_from: prices[1],
							used_from: prices[2]
						};

						// console.log('==================');
						// console.log('amazonPrices', amazonPrices);
						// console.log('==================');

						// add prices to book model
						Object.keys(bookModel.model.prices).forEach(
							bookModelFormat => {
								if (
									amazonFormat.toLowerCase() ===
									bookModelFormat
								) {
									bookModel.model.prices[
										bookModelFormat
									] = amazonPrices;
								}
							}
						);
					});

					return bookModel;
				} else {
					console.log(`no isbn for ${bookModel.model.title}`); //TODO handle this better
				}
			} catch (error) {
				console.log('error', error);
			}
		})
	);

	return resolvedBookModels.filter(Boolean);

	// await browser.close();
};

module.exports = pageScraper;
