
Tsundoku
==========
A tool that outputs the books in your Goodreads `To Read` list in a csv file, along with their Amazon prices for different formats.

**NOTE** This is a work in progress - it's not good at telling you when there are errors, and it doesn't have tests or linting(!) I'm working on it slowly in the background and will get to a stable version eventually, but am making it public now in the spirit of iterative release and making work visible early :)

Table of Contents
-----------------

 - [Why](#why-does-this-exist)
 - [Requirements](#requirements)
 - [Usage](#usage)
 - [Troubleshooting](#Troubleshooting)
 - [Development](#Development)
 - [Things still to do](#things-still-todo)
 - [A note on the name](#a-note-on-the-name)

Why does this exist
------------

Because when I want a new book I spend too long manually browsing Amazon to find which of the books I want to read is currently cheapest

Requirements
------------

 - Goodreads User ID - the 8 digit number in your Goodreads profile URL
 - [Goodreads API key](https://www.goodreads.com/api/keys)
 - Amazon cookie value - visit amazon.co.uk, and copy the request cookie value from the Chrome dev tools network tab (you will need to reload the page if you didn't already have it open). Copying the cookie from a browser while in incognito / private mode is ideal as the cookie is shorter and less prone to be incorrectly parsed by bash.

Usage
-----

### Setting config values 

The first time you use the tool you will need to pass in your Good Reads API key, your Good Reads user ID, and a value for an Amazon cookie using the `setConfig` command. These will be stored so you won't need to provide them again. You can use the `setConfig` command at any time to update any of these values.

```
$ npx tsundoku setConfig --goodReadsId=<your_id> --goodReadsKey=<your_key> --cookie=<cookie_value>
```

**Note:** wrap the cookie value in single quotes (`'`) when you pass it into the `cookie` command - this will stop `bash` expanding any of the `=` in the cookie into variables which would cause the script to error

### Running the tool

Once you've set the config values you can run Tsundoku to output your price list csv file using the `run` command:

```
$ npx tsundoku run
```

The output is a csv file in the module root - the name of the file will be logged to your terminal and you should be able to open it by doing `command + click` on the filename (on Mac) or `control + click` on the filename (on Windows)

Troubleshooting
-----

If you're seeing an error during the price scraping step it may be for a couple of reasons:
- Your cookie is out of date. As far as I can tell Amazon don't have timestamps on these cookies, but if you have been using the same one for a long time (months and months) Amazon may block the requests. You can manually update your cookie value in `config.js`
- Your Goodreads 'To Read' list is too long. The longest list I've tested this with is about 130 books. When Amazon receives too many requests in a short time it eventually blocks them. Rate limiting is in place in the tool to stop this from happening and works with the lists I've tried, but if you have hundreds and hundreds of books in your list you _might_ need pass in a subset (you will need to manually edit the code for this).

Development
-----

To run locally:

 - Clone the Tsundoku repo to your machine
 - Do `npm install`
 - Set config with `./bin/tsundoku.js setConfig --goodReadsId=<your_id> --goodReadsKey=<your_key> --cookie=<cookie_value>`
 - Run with `./bin/tsundoku.js run`

 The tool will retrieve your goodReads list from the goodReads API, then scrape Amazon for the prices of those books. Both of those things take time, but you can watch the progress via the logs in your console. Once the tool has prices for all your 'To Read' list it will output them to the root of the project folder, to a csv file with the name format `[unix-timestamp].output.csv`

There are a set of test values that you can play around with in `./server/test`:

 - `good-reads-api-output` is a mocked set of returned and formatted results from the Good Reads API, use this to save yourself having to hit the Good Reads API every time you want to run Tsundoku during development. These values have already been imported into `index.js` in the relevant place as `goodReadsTestResponse` - to use them just comment out the line using production values and uncomment the line that uses the test values.
 - `book-objects-for-export` is a mocked set of returned and formatted results from the Amazon price scrape, use this to save yourself having to scrape prices from Amazon every time you want to run Tsundoku during development. These values have already been imported into `index.js` in the relevant place as `testBookDetailsWithPrices` - to use them just comment out the line using production values and uncomment the line that uses the test values.
 

Things still to do
---------------------

 - Error handling
 - Help pages
 - Tests
 - Linting
 - Update README to elaborate on how to get Good Reads API key, Good Reads ID, and cookie from Amazon
 - Contribution guidelines
 - Output to google doc
 - Refactor to work more like cli tool and less like an app
 - Allow user to pass limit of how many books to scrape
 - Update README with shields?
 
A note on the name
---------------------

Tsundoku is a [Japaenese word](https://theculturetrip.com/asia/japan/articles/theres-a-special-japanese-word-for-people-addicted-to-buying-books/), which describes the habit of accumulating more books than you can actually get around to reading.
