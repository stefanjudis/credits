'use strict';

var fs          = require( 'fs' );
var path        = require( 'path' );

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

  // projects without dependencies won't have
  // a bower_components folder
  try {
    var deps = fs.readdirSync( depPath );
  } catch( error ) {
    return credits;
  }

  deps.forEach( function( name ) {
    var bowerJsonPath = path.join( depPath, name, 'bower.json' );

    // it might possible that some modules are missing
    // the bower.json file
    try {
      var bowerJson = require( bowerJsonPath );
    } catch( error ) {
      return credits;
    }

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
