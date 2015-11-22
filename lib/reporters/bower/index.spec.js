import test from 'ava';
import tmp from 'tmp';
import fs from 'fs';
import getBowerCredits from './';

test( 'getBowerCredits - get availalbe bower credits', t => {
  tmp.dir( { unsafeCleanup : true }, ( error, path, cleanUpCb ) => {
    fs.mkdirSync( `${path}/bower_components` );

    fs.mkdirSync( `${path}/bower_components/foo` );
    fs.writeFileSync(
      `${path}/bower_components/foo/bower.json`,
      JSON.stringify( {
        authors : [
          'Bob Calsow'
        ]
      } ),
      'utf8'
    );


    fs.mkdirSync( `${path}/bower_components/bar` );
    fs.writeFileSync(
      `${path}/bower_components/bar/bower.json`,
      JSON.stringify( {
        authors : [
          {
            name  : 'Alice Bobson',
            email : 'alicebobson@@alison.io'
          }
        ]
      } ),
      'utf8'
    );

    let credits = getBowerCredits( path );

    t.same( credits[ 0 ].name, 'Alice Bobson' );
    t.same( credits[ 0 ].email, 'alicebobson@@alison.io' );
    t.same( credits[ 0 ].packages, [ 'bar' ] );

    t.same( credits[ 1 ].name, 'Bob Calsow' );
    t.same( credits[ 1 ].packages, [ 'foo' ] );

    cleanUpCb();

    t.end();
  } );
} );
