'use strict';

var fs          = require( 'fs' );
var path        = require( 'path' );
var globby      = require( 'globby' );

var creditUtil  = require( '../../credit' );
var packageUtil = require( '../../package' );

/**
* Read  and evaluate dependency credits for npm module
*
* @param  {String} packagePath        absolute path to package.json file
* @param  {Array}  credits            list of credits to append to
* @return {Array}                     list of credits
*/
function getNpmCredits( packagePath, credits ) {
  var directoryPath = path.dirname( packagePath );
  var name = path.basename( path.dirname( packagePath ) );

  if (
    name[ 0 ] !== '.' &&
    (
      fs.lstatSync( directoryPath ).isDirectory() ||
      fs.lstatSync( directoryPath ).isSymbolicLink()
    )
  ) {
    var packageJson = require( packagePath );
    var author      = packageUtil.getAuthor( packageJson );
    var maintainers = packageUtil.getMaintainers( packageJson );

    if ( author ) {
      credits = creditUtil.addCreditToCredits( credits, author, name );
    }

    if ( maintainers ) {
      maintainers.forEach( function( maintainer ) {
        credits = creditUtil.addCreditToCredits( credits, maintainer, name );
      } );
    }
  }

  return credits;
}

/**
* Read project root and evaluate dependency credits for node modules
*
* @param  {String} projectPath      absolute path to project root
* @param  {Array|undefined} credits list of credits
* @param  {Array|undefined} seen    list of already iterated packages
*
* @return {Array}                   list of credits
*/
function getCredits( projectPath, credits ) {
  credits = credits || [];

  var depPath = path.join( projectPath, 'node_modules' );

  globby.sync( `${depPath}/**/package.json` )
    .forEach( function( packagePath ) {
      getNpmCredits( packagePath, credits );
    } );

  return credits;
}

module.exports = getCredits;
module.exports.getNpmCredits = getNpmCredits;
