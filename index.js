'use strict';

var fs            = require( 'fs' );
var path          = require( 'path' );
var config        = require( './config' );
var creditUtil    = require( './util/credit' );
var packageUtil   = require( './util/package' );
var analyzersUtil = require( './util/analyzers' );
var Promise       = require( 'es6-promise' ).Promise;


/**
 * Read project root and evaluate dependency credits
 * for all supported package managers
 *
 * @param  {String} projectPath  absolute path to project root
 *
 * @return {Array}               list of credits
 *
 * @tested
 */
function readDirectory( projectPath ) {
  var credits = [];

  var analyzers = analyzersUtil.getAnalyzers( config );

  analyzers.forEach( function( analyzer ) {
    credits = credits.concat( analyzer( projectPath ) );
  } );

  return credits;
}

module.exports = function( projectPath ) {
  return new Promise(
    function( resolve, reject ) {
      if ( fs.existsSync( projectPath ) ) {
        try {
          var credits = readDirectory( projectPath );
        } catch( e ) {
          return reject( e );
        }

        credits = credits.sort( function( a, b ) {
          return b.packages.length - a.packages.length;
        } );

        resolve( credits );
      } else {
        reject( new Error( projectPath + ' does not exist' ) );
      }
    }
  );
};
