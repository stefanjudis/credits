'use strict';

const path = require('path');
const globby = require('globby');

const creditUtil = require('../../credit');
const packageUtil = require('../../package');

/**
* Read  and evaluate dependency credits for bower module
*
* @param  {String} bowerJsonPath      absolute path to bower file
* @param  {Array}  credits            list of credits to append to
* @return {Array}                     list of credits
*/
function getBowerCredits(bowerJsonPath, credits) {
	const bowerJson = packageUtil.readJSONSync(bowerJsonPath);
	const name = bowerJson.name || path.basename(path.dirname(bowerJsonPath));
	const authors = packageUtil.getAuthor(bowerJson);

	if (authors) {
		authors.forEach(author => {
			credits = creditUtil.addCreditToCredits(credits, author, name);
		});
	}

	return credits;
}

/**
* Read project root and evaluate dependency credits for bower modules
*
* @param  {String} projectPath      absolute path to project root
* @param  {Array}  credits          list of credits to append to
* @return {Array}                   list of credits
*/
function getCredits(projectPath, credits) {
	credits = credits || [];

	const depPath = path.join(projectPath, 'bower_components');

	globby.sync([`${depPath}/*/bower.json`])
		.forEach(bowerJsonPath => {
			getBowerCredits(bowerJsonPath, credits);
		});

	return credits;
}

module.exports = getCredits;
module.exports.getBowerCredits = getBowerCredits;
