'use strict';

var allStars = require( 'all-stars' );

/**
 * Check all-stars db for given person and normalize person data if found.
 *
 * @param  {Object|false} person object representing author or maintainer
 *
 * @return {Object|false}        same object given, possibly modified or augmented
 */
function getAllStar( person ) {
  if ( !person ) return person;

  var allStar = allStars( person );
  if ( allStar ) {
    // normalize name and email
    var name = allStar.name();
    var email = allStar.email();
    if ( name ) person.name = name;
    if ( email ) person.email = email;
    // add values only defined in all-stars
    person.npm = allStar.npmUser();
    person.github = allStar.githubUser();
    person.twitter = allStar.twitter();
  }
  return person;
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

  return getAllStar( packageJson.author ?
          packageJson.author :
          false );
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
