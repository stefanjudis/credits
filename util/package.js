'use strict';

var allStars = require( 'all-stars' );
var objectAssign = require( 'object-assign' );

/**
 * Check all-stars db for given person and assign to person if found.
 *
 * @param  {Object} person object representing author or maintainer
 *
 * @return {Object}        same object given, possibly modified or augmented
 */
function getAllStar( person ) {
  // override properties from all-stars if available
  var allStar = allStars( person );
  return allStar ? objectAssign( person, allStar.subset() ) : person;
}

/**
 * Parse npm string shorthand into object representation
 *
 * @param  {String} personString string shorthand for author or maintainer
 *
 * @return {Object}              object representing author or maintainer
 */
function getPersonObject( personString ) {
  var regex = personString.match( /^(.*?)\s?(<(.*)>)?\s?(\((.*)\))?\s?$/ );

  return getAllStar( {
    name  : regex[ 1 ],
    email : regex[ 3 ],
    url   : regex[ 5 ]
  } );
}


/**
 * Extract author from package.json content
 *
 * @param  {Object} packageJson content of package.json
 *
 * @return {Object|false}       author if exists or false
 *
 * @tested
 */
function getAuthor( packageJson ) {
  if ( typeof packageJson.author === 'string' ) {
    return getPersonObject( packageJson.author );
  }

  return packageJson.author ?
          getAllStar( packageJson.author ) :
          false;
}


/**
 * Extract maintainers from package.json content
 *
 * @param  {Object} packageJson content of package.json
 *
 * @return {Array}              maintainers if exists or false
 *
 * @tested
 */
function getMaintainers( packageJson ) {
  if ( packageJson.maintainers instanceof Array ) {
    packageJson.maintainers = packageJson.maintainers.map( function( maintainer ) {
      if ( typeof maintainer === 'string' ) {
        return getPersonObject( maintainer );
      }

      return getAllStar( maintainer );
    } );
  }

  // safety fix for people doing
  // -> "maintainers" : "Bob <some.email>"
  if ( typeof packageJson.maintainers === 'string' ) {
    packageJson.maintainers = [ getPersonObject( packageJson.maintainers ) ];
  }

  return packageJson.maintainers ?
          packageJson.maintainers :
          false;
}

module.exports = {
  getAuthor      : getAuthor,
  getMaintainers : getMaintainers
};
