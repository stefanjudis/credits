'use strict';

var path        = require( 'path' );
var globby      = require( 'globby' );

var creditUtil  = require( '../../credit' );
var packageUtil = require( '../../package' );

/**
* Read  and evaluate dependency credits for bower module
*
* @param  {String} bowerJsonPath      absolute path to bower file
* @param  {Array}  credits            list of credits to append to
* @return {Array}                     list of credits
*/
function getBowerCredits( bowerJsonPath, credits ) {
  var name = path.basename( path.dirname( bowerJsonPath ) );
  var bowerJson = require( bowerJsonPath );

  var authors = packageUtil.getAuthor( bowerJson );

  if ( authors ) {
    authors.forEach( function( author ) {
      credits = creditUtil.addCreditToCredits( credits, author, name );
    } );
  }

  return credits;
}

/**
* Read project root and evaluate dependency credits for bower modules
*
* @param  {String} projectPath      absolute path to project root
*
* @return {Array}                   list of credits
*/
function getCredits( projectPath, credits ) {
  credits = credits || [];

  var depPath = path.join( projectPath, 'bower_components' );

  globby.sync( [ `${depPath}/*/bower.json` ] )
    .forEach( function( bowerJsonPath ) {
      getBowerCredits( bowerJsonPath, credits );
    } );

  return credits;
}

module.exports = getCredits;
module.exports.getBowerCredits = getBowerCredits;
