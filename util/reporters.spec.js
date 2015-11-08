import test from 'ava';
import tmp from 'tmp';
import fs from 'fs';
import reportersUtil from './reporters';

test( 'getReporters - iterate over all availalbe reporters', t => {
  tmp.dir( { unsafeCleanup : true }, ( error, path, cleanUpCb ) => {
    fs.mkdirSync( `${path}/reporters` );

    fs.mkdirSync( `${path}/reporters/npm` );
    fs.writeFileSync(
      `${path}/reporters/npm/index.js`,
      'module.exports = \'getNpmCredits\'',
      'utf8'
    );

    let config = {
      filePaths : {
        reporters : path + '/reporters'
      }
    };

    let reporters = reportersUtil.getReporters( config );

    t.same( reporters[ 0 ], 'getNpmCredits' );

    cleanUpCb();

    t.end();
  } );
} );
