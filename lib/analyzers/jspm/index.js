'use strict';

var fs          = require( 'fs' );
var path        = require( 'path' );
var globby      = require( 'globby' );

var creditUtil  = require( '../../credit' );
var packageUtil = require( '../../package' );
var getNpmCredits = require( '../npm' ).getNpmCredits;
var getBowerCredits = require( '../bower' ).getBowerCredits;

/**
* Read project root and evaluate dependency credits for jspm modules
*
* @param  {String} projectPath absolute path to project root
*
* @return {Array}              list of credits
*/
function getCredits( projectPath, credits ) {
  credits    = credits || [];

  var jspmPath = path.join( projectPath, 'jspm_packages' );

  globby.sync( [ `${jspmPath}/npm/*/package.json`, `${jspmPath}/github/*/*/{package.json,bower.json}` ] )
    .forEach( function( packagePath ) {
      if ( path.basename( packagePath ) === 'bower.json' ) {
        return getBowerCredits( packagePath, credits );
      }
      return getNpmCredits( packagePath, credits );
    } );

  return credits;
}

module.exports = getCredits;
