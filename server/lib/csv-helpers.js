const fs = require('fs');
const os = require('os');

const getCsvName = () => {
    const files = fs.readdirSync(`${__dirname}/../..`, (err, files) => {
        if (err) {
            console.log('err', err);
        } else {
            return files
        }
    })
    const csvFiles = files.filter(fileName => fileName.includes('.csv')) || undefined;

    // even if more than 1 file is present, the oldest will appear first in the list and that's always the one we need to work with
    return csvFiles[0];
}

const deleteOldCsv = (csvName) => {
    if (csvName) {
        fs.unlink(`${__dirname}/../../${csvName}`, (err) => {
            if (err) {
                console.error(err)
            } else {
                console.log(`Previous export: ${csvName} was deleted`);
            }
        });
    }
}

const exportToCsv = (booksArray, timestamp) => {
    const filename = `${__dirname}/../../${timestamp}.output.csv`;    
    const output = [['Title', 'Author', 'Kindle Price', 'Hardcover Price New', 'Paperback Price New', 'Paperback Price Used', 'link']]; // holds all rows of data

    booksArray.forEach((book) => {
        const row = []; // a new array for each row of data
        row.push(`"${book.title}"`);
        row.push(`"${book.author}"`);
        row.push(`"${book.prices.kindle.amazon}"`);
        row.push(`"${book.prices.hardcover.amazon}"`);
        row.push(`"${book.prices.paperback.amazon}"`);
        row.push(`"${book.prices.paperback.used_from}"`);
        row.push(`"${book.amazon_link}"`);

        output.push(row.join()); // by default, join() uses a ','
    });

    fs.writeFileSync(filename, output.join(os.EOL));
}

module.exports = {exportToCsv, deleteOldCsv, getCsvName};
