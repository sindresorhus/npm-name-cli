#!/usr/bin/env node
'use strict';
const meow = require('meow');
const logSymbols = require('log-symbols');
const chalk = require('chalk');
const squatter = require('squatter');
const npmName = require('npm-name');

const cli = meow(`
	Usage
	  $ npm-name <name> …

	Examples
	  $ npm-name chalk
	  ${logSymbols.error} ${chalk.bold('chalk')} is unavailable
	  $ npm-name foo
	  ${logSymbols.warning} ${chalk.bold('foo')} is squatted
	  $ npm-name unicorn-cake
	  ${logSymbols.success} ${chalk.bold('unicorn-cake')} is available
	  $ npm-name @sindresorhus/is unicorn-cake
	  ${logSymbols.error} ${chalk.bold('@sindresorhus/is')} is unavailable
	  ${logSymbols.success} ${chalk.bold('unicorn-cake')} is available

	Exits with code 0 when all names are available or 2 when any names are taken
`);

const input = cli.input;

if (input.length === 0) {
	console.error('Specify one or more package names');
	process.exit(1);
}

function log(pkg) {
	const name = chalk.bold(pkg.name);
	if (pkg.available) {
		console.log(`${logSymbols.success} ${name} is available`);
	} else if (pkg.squatter) {
		console.log(`${logSymbols.warning} ${name} is squatted`);
	} else {
		console.log(`${logSymbols.error} ${name} is unavailable`);
	}
}

npmName.many(input)
	.then(available => {
		return Promise.all(Array.from(available.entries()).map(([key, val]) => {
			const ret = {
				name: key,
				available: val
			};
			return val ? ret : squatter(key).then(isSquatter => {
				ret.squatter = isSquatter;
				return ret;
			});
		}));
	})
	.then(pkgs => {
		pkgs.forEach(log);
		process.exit(pkgs.every(pkg => Boolean(pkg.available || pkg.squatter)) ? 0 : 2);
	});
