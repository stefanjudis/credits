'use strict';

/**
 * Parse npm string shorthand into object representation
 *
 * @param  {String} personString string shorthand for author or maintainer
 *
 * @return {Object}              object representing author or maintainer
 */
function getPersonObject( personString ) {
  var regex = personString.match( /^(.*?)\s?(<(.*)>)?\s?(\((.*)\))?\s?$/ );

  return {
    name  : regex[ 1 ],
    email : regex[ 3 ],
    url   : regex[ 5 ]
  };
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
          packageJson.author :
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
    packageJson.maintainers = packageJson.maintainers.map( maintainer => {
      if ( typeof maintainer === 'string' ) {
        return getPersonObject( maintainer );
      }

      return maintainer;
    } );
  }

  return packageJson.maintainers ?
          packageJson.maintainers :
          false;
}

module.exports = {
  getAuthor      : getAuthor,
  getMaintainers : getMaintainers
};
