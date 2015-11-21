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


    credits( path )
      .then( credits => {
        t.same( credits[ 0 ].name, 'Alice Bobson' );
        t.same( credits[ 0 ].packages, [ 'bar', 'boom', 'baz' ] );

        t.same( credits[ 1 ].name, 'Bob Calsow' );
        t.same( credits[ 1 ].packages, [ 'boing', 'foo' ] );

        t.same( credits[ 2 ].name, 'Bob Loblaw' );
        t.same( credits[ 2 ].packages, [ 'cycle', 'linked' ] );

        t.same( credits[ 3 ].name, 'Randy Ran' );
        t.same( credits[ 3 ].packages, [ 'baz' ] );

        t.same( credits[ 4 ].name, 'Bobby Bob' );
        t.same( credits[ 4 ].packages, [ 'baz' ] );

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
