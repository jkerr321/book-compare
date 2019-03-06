
BookCompare
==========
A little app that provides a list of your Goodreads `To Read` list in a sortable table, along with their Amazon prices for different formats:

![image](https://user-images.githubusercontent.com/17846996/53880669-7a2a8100-4009-11e9-9fb5-47e350c44cbf.png)

Table of Contents
-----------------

 - [Why](#why-does-this-exist)
 - [Requirements](#requirements)
 - [Usage](#usage)
 - [Things still to do](#things-still-todo)

Why does this exist
------------

Because when I want a new book I spend too long manually browsing Amazon to find which of the books I want to read is currently cheapest

Requirements
------------

 - [Goodreads API key](https://www.goodreads.com/api/keys)
 - Goodreads User ID - the 8 digit number in your Goodreads profile URL
 - Cookie value

Usage
-----

Currently BookCompare is only able to be run locally:

 - Clone the BookCompare repo to your machine
 - Create a `config.js` file at the root level, using the `config-example.js` file as a template
 - Run `npm install`
 - Run `node app.js`
 - Visit `localhost:8001` in your browser to see your table of books and prices


Things still to do
---------------------

 - Currently Amazon blocks the request when more than about 15 calls are made at a time - fix this somehow: waiting? Batching?
 - Table headings on two lines without messing everything else up (heading and aria-label)
 - Add currency signs
 - Table sort so null values always stay at the bottom of the list
 - Add link for each book
 - Make cli tool instead??
