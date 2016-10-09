import test from 'ava';
import tmp from 'tmp';
import fs from 'fs';
import analyzersUtil from './analyzers';

test.cb( 'getAnalyzers - iterate over all availalbe analyzers', t => {
  tmp.dir( { unsafeCleanup : true }, ( error, path, cleanUpCb ) => {
    fs.mkdirSync( `${path}/analyzers` );

    fs.mkdirSync( `${path}/analyzers/npm` );
    fs.writeFileSync(
      `${path}/analyzers/npm/index.js`,
      'module.exports = \'getCredits\'',
      'utf8'
    );

    let config = {
      filePaths : {
        analyzers : path + '/analyzers'
      }
    };

    let analyzers = analyzersUtil.getAnalyzers( config );

    t.deepEqual( analyzers.npm, 'getCredits' );

    cleanUpCb();

    t.end();
  } );
} );
