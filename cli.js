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
	  $ npm-name abc123
	  ${logSymbols.warning} ${chalk.bold('abc123')} is squatted
	  $ npm-name unicorn-cake
	  ${logSymbols.success} ${chalk.bold('unicorn-cake')} is available
	  $ npm-name @sindresorhus/is unicorn-cake
	  ${logSymbols.error} ${chalk.bold('@sindresorhus/is')} is unavailable
	  ${logSymbols.success} ${chalk.bold('unicorn-cake')} is available

	Exits with code 0 when all names are available or 2 when any names are taken
`);

const {input} = cli;

if (input.length === 0) {
	console.error('Specify one or more package names');
	process.exit(1);
}

function log(pkg) {
	const name = chalk.bold(pkg.name);
	if (pkg.isAvailable) {
		console.log(`${logSymbols.success} ${name} is available`);
	} else if (pkg.isSquatter) {
		console.log(`${logSymbols.warning} ${name} is squatted`);
	} else {
		console.log(`${logSymbols.error} ${name} is unavailable`);
	}
}

(async () => {
	const result = await npmName.many(input);

	const packages = await Promise.all([...result].map(async ([name, isAvailable]) => {
		const ret = {name, isAvailable};

		if (!isAvailable) {
			ret.isSquatter = await squatter(name);
		}

		return ret;
	}));

	for (const pkg of packages) {
		log(pkg);
	}

	process.exit(packages.every(pkg => Boolean(pkg.isAvailable || pkg.isSquatter)) ? 0 : 2);
})();
