#!/usr/bin/env node
'use strict';
const meow = require('meow');
const logSymbols = require('log-symbols');
const chalk = require('chalk');
const squatter = require('squatter');
const npmName = require('npm-name');
const terminalLink = require('terminal-link');
const ora = require('ora');
const organizationRegex = require('org-regex')({exact: true});

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
	  $ npm-name @ava
	  ${logSymbols.error} ${chalk.bold('@ava')} is unavailable
	  $ npm-name @abc123
	  ${logSymbols.success} ${chalk.bold('@abc123')} is available
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
	const styledName = chalk.bold(pkg.name);
	const linkedName = pkg.isOrganization ?
		terminalLink(styledName, `https://www.npmjs.com/org/${pkg.name.slice(1)}`) :
		terminalLink(styledName, `https://www.npmjs.com/package/${pkg.name}`);

	if (pkg.isAvailable) {
		console.log(`${logSymbols.success} ${styledName} is available`);
	} else if (pkg.isSquatter) {
		console.log(`${logSymbols.warning} ${linkedName} is squatted`);
	} else {
		console.log(`${logSymbols.error} ${linkedName} is unavailable`);
	}
}

const spinner = ora(`Checking ${input.length === 1 ? 'name' : 'names'} on npmjs.com…`).start();

(async () => {
	const result = await npmName.many(input);

	const packages = await Promise.all([...result].map(async ([name, isAvailable]) => {
		const ret = {name, isAvailable, isOrganization: organizationRegex.test(name)};

		if (!isAvailable && !ret.isOrganization) {
			ret.isSquatter = await squatter(ret.name);
		}

		return ret;
	}));

	spinner.stop();

	for (const pkg of packages) {
		log(pkg);
	}

	process.exit(packages.every(pkg => Boolean(pkg.isAvailable || pkg.isSquatter)) ? 0 : 2);
})().catch(error => {
	spinner.stop();
	console.error(error);
	process.exit(1);
});
