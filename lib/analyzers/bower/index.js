'use strict';

var fs          = require( 'fs' );
var path        = require( 'path' );
var globby      = require( 'globby' );

var creditUtil  = require( '../../credit' );
var packageUtil = require( '../../package' );


/**
* Read project root and evaluate dependency credits for bower modules
*
* @param  {String} projectPath      absolute path to project root
*
* @return {Array}                   list of credits
*/
function getCredits( projectPath ) {
  var credits = [];

  var depPath = path.join( projectPath, 'bower_components' );

  globby.sync( [ `${depPath}/*/bower.json` ] )
    .forEach( function( bowerJsonPath ) {
      var name = path.basename( path.dirname( bowerJsonPath ) );
      var bowerJson = require( bowerJsonPath );

      var authors = packageUtil.getAuthor( bowerJson );

      if ( authors ) {
        authors.forEach( function( author ) {
          credits = creditUtil.addCreditToCredits( credits, author, name );
        } );
      }
    } );

  return credits;
}

module.exports = getCredits;
