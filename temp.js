var credits    = require( './index' );
var creditPath = '/Users/rbit/Projects/CSSclasses';
var fs         = require( 'fs' );

/**
 * @param {String} creditPath path to the project you want to analyze
 *
 * @return {Promise}
 */
credits( creditPath )
  .then( function( credits ) {
    // console.log( credits );

    var outputPath = 'temp.json';

    fs.writeFile( outputPath, JSON.stringify( credits, null, 4 ) );
  } )
  .catch( function( error ) {
    console.log( error );

    process.exit( 1 );
  } );
