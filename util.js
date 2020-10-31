const squatter = require('squatter');
const npmName = require('npm-name');
const organizationRegex = require('org-regex')({exact: true});
const thesaurus = require('thesaurus');
const slugify = require('slugify').default;
/**
 * Check whether a bunch of names are available
 * @param {string[]} input
 * @return {Promise<
 * Array<{
 * 	name: string;
 *  isAvailable: boolean;
 *  isOrganization: boolean;
 *  isSquatter?: boolean;
 * }
 * > | void>}
 */
async function checkNames(input) {
	const result = await npmName.many(input);

	const packages = await Promise.all(
		[...result].map(async ([name, isAvailable]) => {
			const ret = {
				name,
				isAvailable,
				isOrganization: organizationRegex.test(name)
			};

			if (!isAvailable && !ret.isOrganization) {
				ret.isSquatter = await squatter(ret.name);
			}

			return ret;
		})
	);

	return packages;
}

/**
 * Gets a list of similar package names that are available.
 *
 * @param {{
 *   name: string;
 *   isAvailable: boolean;
 *   isOrganization: boolean;
 * 	 isSquatter?: boolean;
 *  }} pkg
 * @return {Promise<Array<string> | void>}
 */
async function getSimilarPackageNames(pkg) {
	if (pkg.name) {
		const name = pkg.name.replace(/@/, '');
		const names = thesaurus.find(name);
		if (names) {
			const filteredNames = names.map(name => slugify(name.toLowerCase()));
			return pkg.isOrganization ? filteredNames.map(item => `@${item}`) : filteredNames;
		}
	}
}

module.exports = {getSimilarPackageNames, checkNames};
