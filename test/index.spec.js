import test from 'ava';
import tmp from 'tmp';
import fs from 'fs';
import path from 'path';

import credits from '../';

const fixtures = path.resolve( './fixtures' );

test( 'credits - folder exists', t => {
  return credits( fixtures )
      .then( credits => {
        t.deepEqual( credits.npm[ 0 ].name, 'Alice Bobson' );
        t.deepEqual( credits.npm[ 0 ].packages.sort(), [ 'bar', 'boom', 'boz' ] );
      } );
} );

test( 'credits - folder does not exist', t => {
  return credits( '/path/that/does/not/exist' )
    .catch( error => {
      t.deepEqual( error.message, '/path/that/does/not/exist does not exist' );
      t.pass();
    } );
} );
