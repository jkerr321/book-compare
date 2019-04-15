#!/usr/bin/env node
const argv = require('yargs').argv;
const config = require('../config');
const { init } = require('../server/index')

if (argv.goodReadsId) {
    config.GOODREADS_USER = argv.goodReadsId;

    init(config);
} else {
    console.log('please enter your Good Reads user ID - you can find it on the end of the URL of your Good Reads profile page')
}

//TODO handle when cookie needs updating