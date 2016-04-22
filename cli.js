#!/usr/bin/env node
'use strict';
const meow = require('meow');
const logSymbols = require('log-symbols');
const chalk = require('chalk');
const npmName = require('npm-name');

const cli = meow(`
	Usage
	  $ npm-name <name> …

	Examples
	  $ npm-name chalk
	  ${logSymbols.error} ${chalk.bold('chalk')} is unavailable
	  $ npm-name unicorn-cake
	  ${logSymbols.success} ${chalk.bold('unicorn-cake')} is available
	  $ npm-name chalk unicorn-cake
	  ${logSymbols.error} ${chalk.bold('chalk')} is unavailable
	  ${logSymbols.success} ${chalk.bold('unicorn-cake')} is available

	Exits with code 0 when all names are available or 2 when any names are taken
`, {
	string: ['_']
});

const input = cli.input;

if (input.length === 0) {
	console.error('Specify a package name');
	process.exit(1);
}

function log(val, key) {
	const name = chalk.bold(key);
	console.log(val ? `${logSymbols.success} ${name} is available` : `${logSymbols.error} ${name} is unavailable`);
}

npmName.many(input).then(available => {
	available.forEach(log);
	process.exit(Array.from(available.values()).every(Boolean) ? 0 : 2);
});
