'use strict';

const fs          = require( 'fs' );
const path        = require( 'path' );
const creditUtil  = require( './util/credit' );
const packageUtil = require( './util/package' );


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
function readDirectory( projectPath, credits ) {
  credits = credits || [];

  let depPath = path.join( projectPath, 'node_modules' );

  // projects without dependencies won't have
  // a node_modules folder
  try {
    var deps = fs.readdirSync( depPath );
  } catch( error ) {
    return credits;
  }

  deps.forEach( name => {
    if ( name !== '.bin' ) {
      let packageJson = require( path.join( depPath, name, 'package.json' ) );
      let author      = packageUtil.getAuthor( packageJson );
      let maintainers = packageUtil.getMaintainers( packageJson );

      if ( author ) {
        credits = creditUtil.addCreditToCredits( credits, author, name );
      }

      if ( maintainers ) {
        maintainers.forEach( ( maintainer ) => {
          credits = creditUtil.addCreditToCredits( credits, maintainer, name );
        } );
      }

      readDirectory( path.join( depPath, name ), credits );
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
