const fs = require('fs');
const os = require('os');

const getCsvName = async () => {
    try {
        const files = fs.readdirSync(`${__dirname}/../..`, (err, files) => {
            if (err) {
                console.error('err', err);
            } else {
                return files
            }
        })
        const csvFiles = files.filter(fileName => fileName.includes('.csv')) || undefined;
    
        // even if more than 1 file is present, the oldest will appear first in the list and that's always the one we need to work with
        return csvFiles[0];
    } catch (err) {
        console.error(`unable to complete function to look for existing CSV output file ${err}`)
    }
}

const deleteOldCsv = async (csvName) => {
    try {
        if (csvName) {
            fs.unlink(`${__dirname}/../../${csvName}`, (err) => {
                if (err) {
                    console.error(err)
                } else {
                    console.log(`Previous export: ${csvName} was deleted`);
                }
            });
        }
    } catch (err) {
        console.error(`unable to complete function to look for existing CSV output file ${err}`)
    }
}

const exportToCsv = async (booksArray, timestamp) => {
    try {
        const filename = `${__dirname}/../../${timestamp}.output.csv`;
        const output = [['Title', 'Author', 'Goodreads Rating', 'Kindle Price', 'Hardcover Price New', 'Hardcover Price Used', 'Paperback Price New', 'Paperback Price New', 'link']]; // holds all rows of data
    
        booksArray.forEach((book) => {
            const row = []; // a new array for each row of data
            row.push(`"${book.title}"`);
            row.push(`"${book.author}"`);
            row.push(`"${book.average_rating}"`);
            row.push(`"${book.prices.kindle.amazon}"`);
            row.push(`"${book.prices.hardcover.amazon}"`);
            row.push(`"${book.prices.hardcover.used_from}"`);
            row.push(`"${book.prices.paperback.amazon}"`);
            row.push(`"${book.prices.paperback.used_from}"`);
            row.push(`"${book.amazon_link}"`);
    
            output.push(row.join()); // by default, join() uses a ','
        });
    
        fs.writeFileSync(filename, output.join(os.EOL));
    } catch (err) {
        console.error(` ${err}`)
    }
}

module.exports = { exportToCsv, deleteOldCsv, getCsvName };
