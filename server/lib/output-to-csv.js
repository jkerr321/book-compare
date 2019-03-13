
const fs = require('fs');
const path = require('path');
const os = require('os');

const exportToCsv = (bookObjectsArray) => {
    const filename = './output.csv';
    const output = [['Title', 'Author', 'Goodreads Rating', 'Kindle Price', 'Hardcover Price New', 'Hardcover Price Used', 'Paperback Price New', 'Paperback Price New']]; // holds all rows of data

    bookObjectsArray.forEach((book) => {
        const row = []; // a new array for each row of data
        row.push(`"${book.title}"`);
        row.push(`"${book.author}"`);
        row.push(`"${book.average_rating}"`);
        row.push(`"${book.prices.kindle.amazon}"`);
        row.push(`"${book.prices.hardcover.amazon}"`);
        row.push(`"${book.prices.hardcover.used_from}"`);
        row.push(`"${book.prices.paperback.amazon}"`);
        row.push(`"${book.prices.paperback.used_from}"`);

        output.push(row.join()); // by default, join() uses a ','
    });

    fs.writeFileSync(filename, output.join(os.EOL));
}

module.exports = exportToCsv;
