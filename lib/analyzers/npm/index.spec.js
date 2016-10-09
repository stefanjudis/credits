import test from 'ava';
import tmp from 'tmp';
import fs from 'fs';
import getCredits from './';

test.cb( 'getCredits - get availalbe npm credits', t => {
  tmp.dir( { unsafeCleanup : true }, ( error, path, cleanUpCb ) => {
    fs.mkdirSync( `${path}/node_modules` );

    fs.mkdirSync( `${path}/node_modules/foo` );
    fs.writeFileSync(
      `${path}/node_modules/foo/package.json`,
      JSON.stringify( { author : 'Bob Calsow' } ),
      'utf8'
    );


    fs.mkdirSync( `${path}/node_modules/bar` );
    fs.writeFileSync(
      `${path}/node_modules/bar/package.json`,
      JSON.stringify( { author : 'Alice Bobson' } ),
      'utf8'
    );


    fs.mkdirSync( `${path}/node_modules/bar/node_modules` );
    fs.mkdirSync( `${path}/node_modules/bar/node_modules/boom` );

    fs.writeFileSync(
      `${path}/node_modules/bar/node_modules/boom/package.json`,
      JSON.stringify( { author : { name : 'Alice Bobson' } } ),
      'utf8'
    );

    fs.mkdirSync( `${path}/node_modules/baz` );
    fs.writeFileSync(
      `${path}/node_modules/baz/package.json`,
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

    fs.mkdirSync( `${path}/node_modules/baz/node_modules` );
    fs.mkdirSync( `${path}/node_modules/baz/node_modules/boing` );

    fs.writeFileSync(
      `${path}/node_modules/baz/node_modules/boing/package.json`,
      JSON.stringify( { author : 'Bob Calsow <bob@calsow.io>' } ),
      'utf8'
    );



    fs.mkdirSync( `${path}/linked/` );
    fs.writeFileSync(
      `${path}/linked/package.json`,
      JSON.stringify( { author : 'Bob Loblaw' } ),
      'utf8'
    );
    fs.symlinkSync( `${path}/linked`, `${path}/node_modules/linked` );


    fs.mkdirSync( `${path}/node_modules/cycle` );
    fs.writeFileSync(
      `${path}/node_modules/cycle/package.json`,
      JSON.stringify( { author : 'Bob Loblaw' } ),
      'utf8'
    );

    fs.mkdirSync( `${path}/node_modules/cycle/node_modules` );
    fs.symlinkSync( `${path}/node_modules/cycle`, `${path}/node_modules/cycle/node_modules/cycle` );

    let credits = getCredits( path );

    t.deepEqual( credits[ 0 ].name, 'Alice Bobson' );
    t.deepEqual( credits[ 0 ].packages, [ 'bar', 'boom', 'baz' ] );

    t.deepEqual( credits[ 1 ].name, 'Randy Ran' );
    t.deepEqual( credits[ 1 ].packages, [ 'baz' ] );

    t.deepEqual( credits[ 2 ].name, 'Bobby Bob' );
    t.deepEqual( credits[ 2 ].packages, [ 'baz' ] );

    t.deepEqual( credits[ 3 ].name, 'Bob Calsow' );
    t.deepEqual( credits[ 3 ].packages, [ 'boing', 'foo' ] );

    t.deepEqual( credits[ 4 ].name, 'Bob Loblaw' );
    t.deepEqual( credits[ 4 ].packages, [ 'cycle', 'linked' ] );

    cleanUpCb();

    t.end();
  } );
} );
