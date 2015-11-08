'use strict';

var fs          = require( 'fs' );
var path        = require( 'path' );
var creditUtil  = require( '../../../util/credit' );
var packageUtil = require( '../../../util/package' );


/**
* Read project root and evaluate dependency credits for node modules
* -> this will be run recursively
*
* @param  {String} projectPath      absolute path to project root
* @param  {Array|undefined} credits list of credits
* @param  {Array|undefined} seen    list of already iterated packages
*
* @return {Array}                   list of credits
*/
function getNpmCredits( projectPath, credits, seen ) {
  credits = credits || [];
  seen    = seen || [];

  if ( seen[ projectPath ] ) {
    return credits;
  }

  seen[ projectPath ] = true;

  var depPath = path.join( projectPath, 'node_modules' );

  // projects without dependencies won't have
  // a node_modules folder
  try {
    var deps = fs.readdirSync( depPath );
  } catch( error ) {
    return credits;
  }

  deps.forEach( function( name ) {
    if ( name !== '.bin' ) {
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

      getNpmCredits( fs.realpathSync( path.join( depPath, name ) ), credits, seen );
    }
  } );

  return credits;
}

module.exports = getNpmCredits;
