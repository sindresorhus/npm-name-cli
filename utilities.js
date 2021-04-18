import squatter from 'squatter';
import {npmNameMany} from 'npm-name';
import orgRegex from 'org-regex';
import thesaurus from 'thesaurus';
import slugify from '@sindresorhus/slugify';

const organizationRegex = orgRegex({exact: true});

export async function checkNames(name) {
	const result = await npmNameMany(name);

	const names = await Promise.all([...result].map(async ([name, isAvailable]) => {
		const returnValue = {name, isAvailable, isOrganization: organizationRegex.test(name)};

		if (!isAvailable && !returnValue.isOrganization) {
			returnValue.isSquatter = await squatter(name);
		}

		return returnValue;
	}));

	return names;
}

export async function getSimilarPackages({name, isOrganization}) {
	const similarNames = thesaurus.find(name.replace(/@/, ''));
	if (!similarNames) {
		return [];
	}

	const slugNames = similarNames.map(name => `${isOrganization ? '@' : ''}` + slugify(name.toLowerCase()));
	const similarPackages = await checkNames(slugNames);

	return similarPackages.filter(package_ => package_.isAvailable);
}
