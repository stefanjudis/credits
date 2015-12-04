import test from 'ava';
import credits from './';
import tmp from 'tmp';
import fs from 'fs';

test( 'credits - folder exists', t => {
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
        t.same( credits.npm[ 0 ].name, 'Bob Calsow' );
        t.same( credits.npm[ 0 ].packages, [ 'foo' ] );

        cleanUpCb();

        t.end();
      } );

  } );
} );

test( 'credits - folder does not exist', t => {
  credits( '/path/that/does/not/exist' )
    .catch( error => {
      t.same( error.message, '/path/that/does/not/exist does not exist' );
      t.end();
    } );
} );
