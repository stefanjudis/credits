'use strict';

var fs          = require( 'fs' );
var path        = require( 'path' );
var creditUtil  = require( '../../../util/credit' );
var packageUtil = require( '../../../util/package' );


/**
 * Helper function for reading a specific jspm category
 *
 * @param  {String} projectPath absolute path to project root
 * @param  {String} category    category name
 *
 * @return {Array}              list of credits
 */
function getCreditsPerCategory( projectPath, category ) {
  var credits = [];

  var depPath = path.join( projectPath, 'jspm_packages/' + category );

  // projects without dependencies won't have
  // a jspm_packages folder
  try {
    var deps = fs.readdirSync( depPath );
  } catch( error ) {
    return credits;
  }

  deps.forEach( function( name ) {
    if ( name !== '.bin' && name.indexOf( '.js' ) === -1 ) {
      var packageJson = require( path.join( depPath, name, 'package.json' ) );
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

/**
* Read project root and evaluate dependency credits for jspm modules
*
* @param  {String} projectPath absolute path to project root
*
* @return {Array}              list of credits
*/
function getCredits( projectPath ) {
  var credits    = [];
  var categories = [ 'npm', 'github/components' ];

  categories.forEach( function( category ) {
    credits = credits.concat( getCreditsPerCategory( projectPath, category ) );
  } );

  return credits;
}

module.exports = getCredits;
