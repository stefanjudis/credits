'use strict';

/**
 * Get credit out of running credits list
 *
 * @param  {Array} credits list of credits
 * @param  {Object} author author
 *
 * @return {Object|false}  existing credit or false
 *
 * @tested
 */
function getCredit( credits, author ) {
  let credit = credits.filter( credit => {
    // fallback to name when no email
    // is available
    if ( credit.email && author.email ) {
      return credit.email === author.email;
    }

    return credit.name === author.name;
  } );

  return credit.length ?
        credit[ 0 ] :
        false;
}


/**
 * Add a credit to running credits list
 *
 * @param {Array} credits  list of credits
 * @param {Object} person  person to give credit
 * @param {String} name    project name to attach to person
 *
 * @return {Array}         list of credits
 *
 * @tested
 */
function addCreditToCredits( credits, person, name ) {
  let credit = getCredit( credits, person );

  if ( ! credit ) {
    credit          = person;
    credit.packages = [];

    credits.push( credit );
  }

  if ( credit.packages.indexOf( name ) === -1 ) {
    credit.packages.push( name );
  }

  return credits;
}


module.exports = {
  getCredit          : getCredit,
  addCreditToCredits : addCreditToCredits
};
