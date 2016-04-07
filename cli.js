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
	  $ npm-name chalk unicorn-cake
	  ${logSymbols.error} ${chalk.bold('chalk')} is unavailable
	  ${logSymbols.success} ${chalk.bold('unicorn-cake')} is available

	Exits with code 0 when the name is available or 2 when taken
`, {
	string: ['_']
});

const input = cli.input;

if (!input) {
	console.error('Package name required');
	process.exit(1);
}

npmName(input).then(available => {
  input.forEach((name, indx) => {
    outputStatus(name, available[indx]);
  });

	process.exit(available.indexOf(false) > -1 ? 2 : 0);
});

function outputStatus(input, available) {
	const name = chalk.bold(input);
	console.log(available ? `${logSymbols.success} ${name} is available` : `${logSymbols.error} ${name} is unavailable`);
}
