#!/usr/bin/env node
const fs = require('fs');
const argv = require('yargs').argv;
const { init } = require('../server/index')

if (argv.goodReadsId && argv.goodReadsKey && argv.cookie) {
    const config = {
        GOODREADS_USER: argv.goodReadsId,
        GOODREADS_KEY: argv.goodReadsKey,
        COOKIE: argv.cookie
    }

    // add config vars to config file
    fs.writeFileSync(`${__dirname}/../config.js`, `module.exports = ${JSON.stringify(config)}`, err => {
        if (err) console.error(`error writing config file: ${error}`);
        else console.log('updated config with your options');
    })
}

//TODO error handling

init();
