import test from 'ava';
import tmp from 'tmp';
import fs from 'fs-extra';
import path from 'path';

import getCredits from '../lib/analyzers/npm';

const fixtures = path.resolve( './fixtures' );

test( 'getCredits - get available npm credits', t => {
  fs.ensureSymlinkSync( `${fixtures}/linked`, `${fixtures}/node_modules/linked` );
  fs.ensureSymlinkSync( `${fixtures}/node_modules/cycle`, `${fixtures}/node_modules/cycle/node_modules/cycle` );

  const credits = getCredits( fixtures );

  t.deepEqual( credits[ 0 ].name, 'Alice Bobson' );
  t.deepEqual( credits[ 0 ].packages.sort(), [ 'bar', 'boom', 'boz' ] );

  t.deepEqual( credits[ 1 ].name, 'Bob Calsow' );
  t.deepEqual( credits[ 1 ].packages.sort(), [ 'boing', 'foo' ] );

  t.deepEqual( credits[ 2 ].name, 'Randy Ran' );
  t.deepEqual( credits[ 2 ].packages, [ 'boz' ] );

  t.deepEqual( credits[ 3 ].name, 'Bobby Bob' );
  t.deepEqual( credits[ 3 ].packages, [ 'boz' ] );

  t.deepEqual( credits[ 4 ].name, 'Bob Loblaw' );
  t.deepEqual( credits[ 4 ].packages.sort(), [ 'cycle', 'linked' ] );
} );
