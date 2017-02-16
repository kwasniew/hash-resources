#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var hasher = require('./');
var hashed = hasher(argv).toString();
console.log(hashed);