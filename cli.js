#!/usr/bin/env node
import process from 'node:process';
import meow from 'meow';
import logSymbols from 'log-symbols';
import chalk from 'chalk';
import terminalLink from 'terminal-link';
import ora from 'ora';
import {getSimilarPackages, checkNames} from './utilities.js';

const cli = meow(
	`
	Usage
	  $ npm-name <name> …

	Options
	  --similar  Find similar package names too

	Examples
	  $ npm-name chalk
	  ${logSymbols.error} ${chalk.bold('chalk')} is unavailable

	  $ npm-name abc123
	  ${logSymbols.warning} ${chalk.bold('abc123')} is squatted

	  $ npm-name hello --similar
	  ${logSymbols.warning} ${chalk.bold('hello')} is squatted
	  Similar names:
	  ${logSymbols.success} ${chalk.bold('hullo')} is available
	  ${logSymbols.success} ${chalk.bold('how-do-you-do')} is available

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
	`,
	{
		importMeta: import.meta,
		flags: {
			similar: {
				type: 'boolean',
			},
		},
	},
);

const {input} = cli;

if (input.length === 0) {
	console.error('Specify one or more package names');
	process.exit(1);
}

function log(package_) {
	const styledName = chalk.bold(package_.name);
	const linkedName = package_.isOrganization
		? terminalLink(styledName, `https://www.npmjs.com/org/${package_.name.slice(1)}`)
		: terminalLink(styledName, `https://www.npmjs.com/package/${package_.name}`);

	if (package_.isAvailable) {
		console.log(`${logSymbols.success} ${styledName} is available`);
	} else if (package_.isSquatter) {
		console.log(`${logSymbols.warning} ${linkedName} is squatted`);
	} else {
		console.log(`${logSymbols.error} ${linkedName} is unavailable`);
	}
}

const spinner = ora(`Checking ${input.length === 1 ? 'name' : 'names'} on npmjs.com…`).start();

async function main() {
	const packages = await checkNames(input);

	spinner.stop();

	for (const package_ of packages) {
		log(package_);

		if (!cli.flags.similar) {
			continue;
		}

		const similarCheckingSpinner = ora('Checking for similar names on npmjs.com…').start();

		// eslint-disable-next-line no-await-in-loop
		const similarPackages = await getSimilarPackages(package_);

		similarCheckingSpinner.stop();

		if (similarPackages.length > 0) {
			console.log('Similar names:');

			for (const package_ of similarPackages) {
				log(package_);
			}

			console.log();
		} else {
			console.log('No similar packages found.\n');
		}
	}

	process.exit(packages.every(package_ => Boolean(package_.isAvailable || package_.isSquatter)) ? 0 : 2);
}

try {
	await main();
} catch (error) {
	spinner.stop();
	console.error(error);
	process.exit(1);
}
