#!/usr/bin/env node
'use strict';
const meow = require('meow');
const logSymbols = require('log-symbols');
const chalk = require('chalk');
const npmName = require('npm-name');

const cli = meow(`
	Usage
	  $ npm-name <name>

	Examples
	  $ npm-name chalk
	  ${logSymbols.error} ${chalk.bold('chalk')} is unavailable
	  $ npm-name unicorn-cake
	  ${logSymbols.success} ${chalk.bold('unicorn-cake')} is available

	Exits with code 0 when the name is available or 2 when taken
`, {
	string: ['_']
});

let input = cli.input[0];

if (input.indexOf(',') > -1) {
	input = input.split(',');
}

if (!input) {
	console.error('Package name required');
	process.exit(1);
}

npmName(input).then(available => {
	let exitWithError = available;

	if (available instanceof Array) {
		for (let i = 0, len = available.length; i < len; i++) {
			outputStatus(input[i], available[i]);
		}

		exitWithError = available.indexOf(false) > -1;
	} else {
		outputStatus(input, available);
	}

	process.exit(exitWithError ? 0 : 2);
});

function outputStatus(input, available) {
	const name = chalk.bold(input);
	console.log(available ? `${logSymbols.success} ${name} is available` : `${logSymbols.error} ${name} is unavailable`);
}
