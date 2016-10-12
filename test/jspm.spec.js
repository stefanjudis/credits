import test from 'ava';
import tmp from 'tmp';
import fs from 'fs';
import path from 'path';

import getCredits from '../lib/analyzers/jspm';

const fixtures = path.resolve( './fixtures' );

test( 'getCredits - get available jspm credits', t => {
  const credits = getCredits( fixtures );

  t.deepEqual( credits[ 0 ].name, 'Alice Bobson' );
  t.deepEqual( credits[ 0 ].packages.sort(), [ 'bar', 'baz' ] );

  t.deepEqual( credits[ 1 ].name, 'Randy Ran' );
  t.deepEqual( credits[ 1 ].packages, [ 'baz' ] );

  t.deepEqual( credits[ 2 ].name, 'Bobby Bob' );
  t.deepEqual( credits[ 2 ].email, 'bobby@bob.io' );
  t.deepEqual( credits[ 2 ].packages, [ 'baz' ] );

  t.deepEqual( credits[ 3 ].name, 'Bob Calsow' );
  t.deepEqual( credits[ 3 ].packages.sort(), [ 'boing', 'foo' ] );

  t.deepEqual( credits[ 4 ].name, 'Janice Robson' );
  t.deepEqual( credits[ 4 ].packages, [ 'boo' ] );

} );
