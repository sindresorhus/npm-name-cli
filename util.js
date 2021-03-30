const squatter = require('squatter');
const npmName = require('npm-name');
const organizationRegex = require('org-regex')({exact: true});
const thesaurus = require('thesaurus');
const slugify = require('slugify').default;

/**
 * The package information
 * @typedef {Object} PackageInfo
 * @property {string} name
 * @property {boolean} isAvailable
 * @property {boolean} isOrganization
 * @property {boolean} [isSquatter]

 * Check whether a bunch of names are available
 * @param {string[]} input
 * @return {Promise<Array<PackageInfo>>}
 */
async function checkNames(input) {
	const result = await npmName.many(input);

	const names = await Promise.all([...result].map(async ([name, isAvailable]) => {
		const ret = {name, isAvailable, isOrganization: organizationRegex.test(name)};

		if (!isAvailable && !ret.isOrganization) {
			ret.isSquatter = await squatter(ret.name);
		}

		return ret;
	}));

	return names;
}

/**
 * Gets a list of similar package names that are available.
 *
 * @param PackageInfo pkg
 * @return {Promise<Array<PackageInfo>>}
 */
async function getSimilarPackages({name, isOrganization}) {
	const similarNames = thesaurus.find(name.replace(/@/, ''));
	if (!similarNames) {
		return [];
	}

	const slugNames = similarNames.map(name => `${isOrganization ? '@' : ''}` + slugify(name.toLowerCase()));
	const similarPackages = await checkNames(slugNames);

	return similarPackages.filter(pkg => pkg.isAvailable);
}

module.exports = {getSimilarPackages, checkNames};
