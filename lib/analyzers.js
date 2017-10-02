'use strict';

const path = require('path');
const globby = require('globby');

/**
 * Get all available analyzers
 *
 * @param  {Object} config project configuration
 *
 * @return {Array}         list of reporter methods
 */
function getAnalyzers(config) {
	const methods = {};
	const basePath = config.filePaths.analyzers;

	globby.sync(`${basePath}/*`)
    .forEach(analyzer => {
	const name = path.basename(analyzer);
	methods[name] = require(analyzer);
});

	return methods;
}

module.exports = {
	getAnalyzers
};
