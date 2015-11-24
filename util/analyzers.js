'use strict';

var fs      = require( 'fs' );
var path    = require( 'path' );

/**
 * Get all available analyzers
 *
 * @param  {Object} config project configuration
 *
 * @return {Array}         list of reporter methods
 */
function getAnalyzers( config ) {
  var analyzers;
  var methods  = [];
  var basePath = config.filePaths.analyzers;

  try {
    var analyzers = fs.readdirSync( basePath );
  } catch( error ) {
    console.log( error );
    throw new Error( 'filePaths \'analyzers\' does not exist' );
  }

  analyzers.forEach( function( reporter ) {
    methods.push( require( path.join( basePath, reporter, 'index' ) ) );
  } );

  return methods;
}

module.exports = {
  getAnalyzers : getAnalyzers
};
