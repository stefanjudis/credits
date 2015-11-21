'use strict';

var fs          = require( 'fs' );
var path        = require( 'path' );
var creditUtil  = require( './util/credit' );
var packageUtil = require( './util/package' );
var Promise     = require( 'es6-promise' ).Promise;


/**
 * Read project root and evaluate dependency credits
 * -> this will be run recursively
 *
 * @param  {String} projectPath       absolute path to project root
 * @param  {Array|undefined} credits  list of credits
 *
 * @return {Array}                    list of credits
 *
 * @tested
 */
function readDirectory( projectPath, credits, seen ) {
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
    var directoryPath = path.join( depPath, name );

    if (
      name !== '.bin' &&
      (
        fs.lstatSync( directoryPath ).isDirectory() ||
        fs.lstatSync( directoryPath ).isSymbolicLink()
      )
    ) {
      var packageJson = require( path.join( directoryPath, 'package.json' ) );
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

      readDirectory( fs.realpathSync( directoryPath ), credits, seen );
    }
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
