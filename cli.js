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

const input = cli.input[0];

if (!input) {
	console.error('Package name required');
	process.exit(1);
}

npmName(input).then(available => {
	const name = chalk.bold(input);
	console.log(available ? `${logSymbols.success} ${name} is available` : `${logSymbols.error} ${name} is unavailable`);
	process.exit(available ? 0 : 2);
});
