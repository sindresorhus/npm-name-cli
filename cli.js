#!/usr/bin/env node
'use strict';
const meow = require('meow');
const logSymbols = require('log-symbols');
const chalk = require('chalk');
const npmName = require('npm-name');

const cli = meow(`
	Usage
	  $ npm-name <name> ...

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
	console.error('Package name required');
	process.exit(1);
}

npmName.many(input).then(available => {
	available.forEach(outputStatus);

	let hasFalseValue = false;
	for (const i of available.values()) {
		if (!i) {
			hasFalseValue = true;
			break;
		}
	}

	process.exit(hasFalseValue ? 2 : 0);
});

function outputStatus(value, key) {
	const name = chalk.bold(key);
	console.log(value ? `${logSymbols.success} ${name} is available` : `${logSymbols.error} ${name} is unavailable`);
}
