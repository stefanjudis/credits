'use strict';

var fs      = require( 'fs' );
var path    = require( 'path' );

/**
 * Get all available reporters
 *
 * @param  {Object} config project configuration
 *
 * @return {Array}         list of reporter methods
 */
function getReporters( config ) {
  var reporters;
  var methods  = [];
  var basePath = config.filePaths.reporters;

  try {
    var reporters = fs.readdirSync( basePath );
  } catch( error ) {
    console.log( error );
    throw new Error( 'filePaths \'reporters\' does not exist' );
  }

  reporters.forEach( function( reporter ) {
    methods.push( require( path.join( basePath, reporter, 'index' ) ) );
  } );

  return methods;
}

module.exports = {
  getReporters : getReporters
};
