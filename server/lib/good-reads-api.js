const fetch = require('node-fetch');
const convert = require('xml-js');
const { GOODREADS_KEY, GOODREADS_USER } = require('../../config');

const convertToJson = async result => {
	try {
		const text = await result.text();
		const partConverted = convert.xml2json(text, {
			compact: true,
			spaces: 4
		});
		return JSON.parse(partConverted);
	} catch (err) {
		console.log(err);
	}
};

const getBookInfo = async () => {
	try {
		const apiResponse = async (n) => {
			const response = await fetch(
				`https://www.goodreads.com/review/list/${GOODREADS_USER}.xml?key=${GOODREADS_KEY}&v=2&shelf=to-read&per_page=200&page=${n}`
			);
			const json = await convertToJson(response);		
			return json.GoodreadsResponse.reviews.review;
		}

		const pageOneResults = await apiResponse(1);
		const pageTwoResults = await apiResponse(2);
		const booksParent = pageOneResults.concat(pageTwoResults);

		return booksParent.map(bookInfo => {
			const book = bookInfo.book;
			return {
				title: book.title._text,
				author: book.authors.author.name._text,
				average_rating: book.average_rating._text,
				isbn: book.isbn._text || null,
				isbn13: book.isbn13._text || null
			};
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports = getBookInfo;
