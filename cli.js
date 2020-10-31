#!/usr/bin/env node
"use strict";
const meow = require("meow");
const logSymbols = require("log-symbols");
const chalk = require("chalk");
const terminalLink = require("terminal-link");
const ora = require("ora");
const { getSimilarPackageNames, checkNames } = require("./util");

const cli = meow(`
	Usage
	  $ npm-name <name> …

	Examples
	  $ npm-name chalk
	  ${logSymbols.error} ${chalk.bold("chalk")} is unavailable
	  $ npm-name abc123
	  ${logSymbols.warning} ${chalk.bold("abc123")} is squatted
	  $ npm-name --similar bigiron
		${logSymbols.warning} ${chalk.bold("bigiron")} is unavailable
	  $ npm-name unicorn-cake
	  ${logSymbols.success} ${chalk.bold("unicorn-cake")} is available
	  $ npm-name @ava
	  ${logSymbols.error} ${chalk.bold("@ava")} is unavailable
	  $ npm-name @abc123
	  ${logSymbols.success} ${chalk.bold("@abc123")} is available
	  $ npm-name @sindresorhus/is unicorn-cake
	  ${logSymbols.error} ${chalk.bold("@sindresorhus/is")} is unavailable
	  ${logSymbols.success} ${chalk.bold("unicorn-cake")} is available

	Exits with code 0 when all names are available or 2 when any names are taken
`);

const { input } = cli;

if (input.length === 0) {
	console.error("Specify one or more package names");
	process.exit(1);
}

function log(pkg) {
	const styledName = chalk.bold(pkg.name);

	const linkedName = pkg.isOrganization
		? terminalLink(styledName, `https://www.npmjs.com/org/${pkg.name.slice(1)}`)
		: terminalLink(styledName, `https://www.npmjs.com/package/${pkg.name}`);

	if (pkg.isAvailable) {
		console.log(`${logSymbols.success} ${styledName} is available`);
	} else if (pkg.isSquatter) {
		console.log(`${logSymbols.warning} ${linkedName} is squatted`);
	} else {
		console.log(`${logSymbols.error} ${linkedName} is unavailable`);
	}
}

// Main

const spinner = ora(
	`Checking ${input.length === 1 ? "name" : "names"} on npmjs.com…`
).start();

(async () => {
	const packages = await checkNames(input);
	spinner.stop();

	if (packages) {
		for (const pkg of packages) {
			log(pkg);

			// Check similar names
			if (!pkg.isAvailable) {
				const spinner = ora(`Checking for similar names on npmjs.com…`).start();

				const similarNames = await getSimilarPackageNames(pkg);
				if (similarNames) {
					const similarNamesArray = similarNames;

					let similarPackages = await checkNames(similarNamesArray);
					if (similarPackages) {
						similarPackages = similarPackages.filter(
							(thing) => thing.isAvailable
						);
					}
					spinner.stop();

					if (similarPackages) {
						console.log(`\nSimilar names:\n`);
						for (const item of similarPackages) {
							log(item);
						}
					}
				} else {
					console.log("No similar names found!");
					spinner.stop();
				}
			}
		}

		process.exit(
			packages.every((pkg) => Boolean(pkg.isAvailable || pkg.isSquatter))
				? 0
				: 2
		);
	}
	process.exit(0);
})().catch((error) => {
	spinner.stop();
	console.error(error);
	process.exit(1);
});
