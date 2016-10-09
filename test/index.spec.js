import test from 'ava';
import tmp from 'tmp';
import fs from 'fs';

import credits from '../';

test.cb( 'credits - folder exists', t => {
  tmp.dir( { unsafeCleanup : true }, ( error, path, cleanUpCb ) => {
    fs.mkdirSync( `${path}/node_modules` );

    fs.mkdirSync( `${path}/node_modules/foo` );
    fs.writeFileSync(
      `${path}/node_modules/foo/package.json`,
      JSON.stringify( { author : 'Bob Calsow' } ),
      'utf8'
    );

    credits( path )
      .then( credits => {
        t.deepEqual( credits.npm[ 0 ].name, 'Bob Calsow' );
        t.deepEqual( credits.npm[ 0 ].packages, [ 'foo' ] );

        cleanUpCb();

        t.end();
      } );

  } );
} );

test.cb( 'credits - folder does not exist', t => {
  credits( '/path/that/does/not/exist' )
    .catch( error => {
      t.deepEqual( error.message, '/path/that/does/not/exist does not exist' );
      t.end();
    } );
} );
