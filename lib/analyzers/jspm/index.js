'use strict';

const path = require('path');
const globby = require('globby');

const {getNpmCredits} = require('../npm');
const {getBowerCredits} = require('../bower');

/**
* Read project root and evaluate dependency credits for jspm modules
*
* @param  {String} projectPath absolute path to project root
*	@param  {Array}  credits            list of credits to append to
* @return {Array}              list of credits
*/
function getCredits(projectPath, credits) {
	credits = credits || [];

	const jspmPath = path.join(projectPath, 'jspm_packages');

	globby.sync([`${jspmPath}/npm/*/package.json`, `${jspmPath}/github/*/*/{package.json,bower.json}`])
		.forEach(packagePath => {
			if (path.basename(packagePath) === 'bower.json') {
				return getBowerCredits(packagePath, credits);
			}
			return getNpmCredits(packagePath, credits);
		});

	return credits;
}

module.exports = getCredits;
