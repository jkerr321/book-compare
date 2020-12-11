const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { Sema } = require('async-sema');
const { COOKIE } = require('../../config');

const getData = async (aisn) => {
	try {
		const url = `https://www.amazon.co.uk/dp/product/${aisn}`;
		const headers = {
			authority: 'www.amazon.co.uk',
			method: 'GET',
			path: `/dp/product/${aisn}`,
			scheme: 'https',
			accept:
				'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
			'accept-encoding': 'gzip, deflate, br',
			'accept-language': 'en-US,en;q=0.9',
			'cache-control': 'max-age=0',
			cookie: COOKIE,
			'upgrade-insecure-requests': 1,
			'user-agent':
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36'
		};

		const res = await fetch(url, { headers });

		console.log(`This code was returned: ${res.status}, ${res.statusText}`);

		const text = await res.text();
		const $ = cheerio.load(text);

		// NB this map is a cheerio object and not a regular array.map hence cannot just return the output,
		// instead need to create a new array and push the output into that
		let priceTableRowsArray = [];
		$('#twister > .top-level').map((i, el) => {
			priceTableRowsArray.push($(el).text());
		});

		return priceTableRowsArray;
	} catch (error) {
		console.log(error);
	}
};

const formatData = async dataArray => {	
	return dataArray.reduce((pricesObject, el) => {
		//remove whitespace
		const cleanString = el.replace(/\s+/g, ' ').trim();

		// extract book format (kindle, hardcover etc)
		const formatRegex = /([a-z]+)/gim;
		const amazonFormat = cleanString.match(formatRegex)[0].toLowerCase();

		// extract prices
		const priceRegex = /(—|[0-9.]+)/gim;
		const prices = cleanString.match(priceRegex);

		//e.g. 'kindle', 'paperback'
		pricesObject[amazonFormat] = {
			amazon: prices[0],
			new_from: prices[1],
			used_from: prices[2]
		};

		return pricesObject;
	}, {});
};

// check all formats are present, if not add a dummy value for them - this is so the client side table can be sorted correctly
const validatePrices = amazonPrices => {
	let validatedPrices = amazonPrices;
	const requiredFormats = ['kindle', 'paperback', 'hardcover'];
	requiredFormats.forEach(format => {
		if (!Object.keys(amazonPrices).includes(format)) {
			validatedPrices[format] = {
				amazon: '—',
				new_from: '—',
				used_from: '—'
			};
		}
	});
	return validatedPrices;
};

const wait = ms => {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
};

const pageScraper = async (bookInfoArray) => {
	const sema = new Sema(1);

	const queue = bookInfoArray.map((bookInfo, i) => async () => {
		await sema.acquire();
		console.log(`processing ${i + 1} of ${bookInfoArray.length}`);
		const result = await pageScrape(bookInfo);
		await wait(1000);
		sema.release();
		return result;
	});

	const resolvedBookPrices = await Promise.all(queue.map(item => item()));

	return resolvedBookPrices.filter(Boolean);
};

const getIsbn = (isbn) => {
	isbn.toString();
	if (isbn && isbn.length < 10) {
		return '0'.concat(isbn);
	} else {
		return isbn;
	}
}

async function pageScrape(bookInfo) {
	try {
		const isbn = getIsbn(bookInfo.isbn);
		if (isbn) {
			// get Amazon Standard Identification Number - the book’s ISBN in its older, 10-digit version
			const aisn = isbn.substring(isbn.length - 10);
			const scrapedDataArray = await getData(aisn);
			const amazonPrices = await formatData(scrapedDataArray);
			const validatedPrices = validatePrices(amazonPrices);
			console.info(`scraped and formatted prices for ${bookInfo.title}`);

			return {
				title: bookInfo.title,
				prices: validatedPrices,
				amazon_link: `https://www.amazon.co.uk/dp/product/${aisn}`
			}
		} else {
			console.info(`no isbn for ${bookInfo.title}`);
		}
	} catch (error) {
		console.log(error);
	}
}

module.exports = pageScraper;
