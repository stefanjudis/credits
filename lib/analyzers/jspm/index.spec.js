import test from 'ava';
import tmp from 'tmp';
import fs from 'fs';
import getCredits from './';

test.cb( 'getCredits - get availalbe jspm credits', t => {
  tmp.dir( { unsafeCleanup : true }, ( error, path, cleanUpCb ) => {
    fs.mkdirSync( `${path}/jspm_packages` );

    fs.mkdirSync( `${path}/jspm_packages/github` );
    fs.mkdirSync( `${path}/jspm_packages/github/components` );
    fs.mkdirSync( `${path}/jspm_packages/github/components/foo` );

    fs.mkdirSync( `${path}/jspm_packages/npm` );
    fs.mkdirSync( `${path}/jspm_packages/npm/boo` );

    fs.writeFileSync(
      `${path}/jspm_packages/github/components/foo/package.json`,
      JSON.stringify( { author : 'Don Calsow' } ),
      'utf8'
    );

    fs.writeFileSync(
      `${path}/jspm_packages/npm/boo/package.json`,
      JSON.stringify( { author : 'Janice Robson' } ),
      'utf8'
    );

    fs.mkdirSync( `${path}/jspm_packages/npm/baz` );
    fs.writeFileSync(
      `${path}/jspm_packages/npm/baz/package.json`,
      JSON.stringify( {
        author      : 'Alice Bobson',
        maintainers : [
          'Randy Ran',
          {
            name  : 'Bobby Bob',
            email : 'bobby@bob.io'
          }
        ]
      } ),
      'utf8'
    );

    fs.mkdirSync( `${path}/jspm_packages/npm/boing` );

    fs.writeFileSync(
      `${path}/jspm_packages/npm/boing/package.json`,
      JSON.stringify( { author : 'Bob Calsow <bob@calsow.io>' } ),
      'utf8'
    );

    let credits = getCredits( path );

    t.deepEqual( credits[ 0 ].name, 'Alice Bobson' );
    t.deepEqual( credits[ 0 ].packages, [ 'baz' ] );

    t.deepEqual( credits[ 1 ].name, 'Randy Ran' );
    t.deepEqual( credits[ 1 ].packages, [ 'baz' ] );

    t.deepEqual( credits[ 2 ].name, 'Bobby Bob' );
    t.deepEqual( credits[ 2 ].email, 'bobby@bob.io' );
    t.deepEqual( credits[ 2 ].packages, [ 'baz' ] );

    t.deepEqual( credits[ 3 ].name, 'Bob Calsow' );
    t.deepEqual( credits[ 3 ].packages, [ 'boing' ] );

    t.deepEqual( credits[ 4 ].name, 'Janice Robson' );
    t.deepEqual( credits[ 4 ].packages, [ 'boo' ] );

    t.deepEqual( credits[ 5 ].name, 'Don Calsow' );
    t.deepEqual( credits[ 5 ].packages, [ 'foo' ] );

    cleanUpCb();

    t.end();
  } );
} );
