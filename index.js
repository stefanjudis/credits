'use strict';

var fs            = require( 'fs' );
var path          = require( 'path' );
var config        = require( './config' );
var creditUtil    = require( './lib/credit' );
var packageUtil   = require( './lib/package' );
var analyzersUtil = require( './lib/analyzers' );
var Promise       = require( 'es6-promise' ).Promise;

/**
 * Read project root and evaluate dependency credits
 * for all supported package managers
 *
 * @param  {String} projectPath  absolute path to project root
 * @param  {Array}  analyzers    list of availalbe analyzers
 *
 * @return {Array}               list of credits
 *
 * @tested
 */
function readDirectory( projectPath, analyzers ) {
  var credits = {};

  for ( var analyzer in analyzers ) {
    credits[ analyzer ] = analyzers[ analyzer ]( projectPath );
  };

  return credits;
}

module.exports = function( projectPath ) {
  var analyzers = analyzersUtil.getAnalyzers( config );

  return new Promise(
    function( resolve, reject ) {
      if ( fs.existsSync( projectPath ) ) {
        try {
          var credits = readDirectory( projectPath, analyzers );
        } catch( e ) {
          return reject( e );
        }

        for ( var analyzer in analyzers ) {
          credits[ analyzer ] = credits[ analyzer ].sort( function( a, b ) {
            return b.packages.length - a.packages.length;
          } );
        };

        resolve( credits );
      } else {
        reject( new Error( projectPath + ' does not exist' ) );
      }
    }
  );
};
