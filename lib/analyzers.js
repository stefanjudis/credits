'use strict';

var path    = require( 'path' );
var globby  = require( 'globby' );

/**
 * Get all available analyzers
 *
 * @param  {Object} config project configuration
 *
 * @return {Array}         list of reporter methods
 */
function getAnalyzers( config ) {
  var methods  = {};
  var basePath = config.filePaths.analyzers;

  globby.sync( `${basePath}/*` )
    .forEach( function( analyzer ) {
      var name = path.basename( analyzer );
      methods[ name ] = require( analyzer );
    } );

  return methods;
}

module.exports = {
  getAnalyzers : getAnalyzers
};
