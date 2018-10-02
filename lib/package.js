'use strict';

const allStars = require('all-stars');
const objectAssign = require('object-assign');

/**
 * Read JSON file.  Returns empty object on ENOENT
 *
 * @param  {String} file file path to JSON
 *
 * @return {Object} package object
 */
function readJSONSync(file) {
	try {
		return require(file);
	} catch (error) {
		return {};
	}
}

/**
 * Check all-stars db for given person and assign to person if found.
 *
 * @param  {Object} person object representing author or maintainer
 *
 * @return {Object}        same object given, possibly modified or augmented
 */
function getAllStar(person) {
	// Override properties from all-stars if available
	const allStar = allStars(person);
	return allStar ? objectAssign(person, allStar.subset()) : person;
}

/**
 * Parse npm string shorthand into object representation
 *
 * @param  {String} personString string shorthand for author or maintainer
 *
 * @return {Object}              object representing author or maintainer
 */
function getPersonObject(personString) {
	const regex = personString.match(/^(.*?)\s?(<(.*)>)?\s?(\((.*)\))?\s?$/);

	return getAllStar({
		name: regex[1],
		email: regex[3],
		url: regex[5]
	});
}

/**
 * Extract author from package.json content
 *
 * @param  {Object} packageJson content of package.json
 *
 * @return {Object|false}       author if exists or false
 *
 * @tested
 */
function getAuthor(packageJson) {
	if (Array.isArray(packageJson.authors)) {
		packageJson.authors = packageJson.authors.map(author => {
			if (typeof author === 'string') {
				return getPersonObject(author);
			}

			return getAllStar(author);
		});

		return packageJson.authors ? packageJson.authors : false;
	}

	if (typeof packageJson.author === 'string') {
		return getPersonObject(packageJson.author);
	}

	return packageJson.author ?
		getAllStar(packageJson.author) :
		false;
}

/**
 * Extract maintainers from package.json content
 *
 * @param  {Object} packageJson content of package.json
 *
 * @return {Array}              maintainers if exists or false
 *
 * @tested
 */
function getMaintainers(packageJson) {
	if (Array.isArray(packageJson.maintainers)) {
		packageJson.maintainers = packageJson.maintainers.map(maintainer => {
			if (typeof maintainer === 'string') {
				return getPersonObject(maintainer);
			}

			return getAllStar(maintainer);
		});
	}

	// Safety fix for people doing
	// -> "maintainers" : "Bob <some.email>"
	if (typeof packageJson.maintainers === 'string') {
		packageJson.maintainers = [getPersonObject(packageJson.maintainers)];
	}

	return packageJson.maintainers ?
		packageJson.maintainers :
		false;
}

module.exports = {
	getAuthor,
	getMaintainers,
	readJSONSync
};
