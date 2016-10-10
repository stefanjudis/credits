'use strict';

var fs          = require( 'fs' );
var path        = require( 'path' );
var globby      = require( 'globby' );

var creditUtil  = require( '../../credit' );
var packageUtil = require( '../../package' );

/**
* Read project root and evaluate dependency credits for jspm modules
*
* @param  {String} projectPath absolute path to project root
*
* @return {Array}              list of credits
*/
function getCredits( projectPath ) {
  var credits    = [];
  var jspmPath = path.join( projectPath, 'jspm_packages' );

  globby.sync( [ `${jspmPath}/npm/*/package.json`, `${jspmPath}/github/*/*/package.json` ] )
    .forEach( function( packagePath ) {
      var name = path.basename( path.dirname( packagePath ) );

      if ( name[ 0 ] !== '.' && name.indexOf( '.js' ) === -1 ) {
        var packageJson = require( path.join( packagePath ) );
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
    } );

  return credits;
}

module.exports = getCredits;
