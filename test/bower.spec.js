import test from 'ava';
import tmp from 'tmp';
import fs from 'fs';
import path from 'path';

import getCredits from '../lib/analyzers/bower';

const fixtures = path.resolve( './fixtures' );

test( 'getCredits - get availalbe bower credits', t => {
  const credits = getCredits( fixtures );

  t.deepEqual( credits[ 0 ].name, 'Alice Bobson' );
  t.deepEqual( credits[ 0 ].email, 'alicebobson@alison.io' );
  t.deepEqual( credits[ 0 ].packages, [ 'bar' ] );

  t.deepEqual( credits[ 1 ].name, 'Bob Calsow' );
  t.deepEqual( credits[ 1 ].packages, [ 'foo' ] );
} );
