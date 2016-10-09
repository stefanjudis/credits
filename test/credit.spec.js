import test from 'ava';

import creditUtil from '../lib/credit';

test( 'getCredit - email is included', t => {
  let credits = [ { email : 'bob@calsow.io', url : 'http://4waisenkinder.de' } ];

  let credit = creditUtil.getCredit( credits, { email : 'bob@calsow.io' } );

  t.deepEqual( credit, { email : 'bob@calsow.io', url : 'http://4waisenkinder.de' } );
} );

test( 'getCredit - only name is included', t => {
  let credits = [ { name : 'Bob Calsow', url : 'http://4waisenkinder.de' } ];

  let credit = creditUtil.getCredit( credits, { name : 'Bob Calsow' } );

  t.deepEqual( credit, { name : 'Bob Calsow', url : 'http://4waisenkinder.de' } );
} );

test( 'getCredit - particular credit is not included', t => {
  let credits = [];

  let credit = creditUtil.getCredit( credits, { name : 'Stefan Judis' } );

  t.deepEqual( credit, false );
} );


test( 'addCreditToCredits - credit is not included yet', t => {
  let credits = [];

  credits = creditUtil.addCreditToCredits( credits, { name : 'Bob Calsow' }, 'foo' );

  t.deepEqual( credits, [ { name : 'Bob Calsow', packages : [ 'foo' ] } ] );
} );

test( 'addCreditToCredits - credit is included', t => {
  let credits = [ { name : 'Bob Calsow', packages : [ 'foo' ] } ];

  credits = creditUtil.addCreditToCredits( credits, { name : 'Bob Calsow' }, 'bar' );

  t.deepEqual( credits, [ { name : 'Bob Calsow', packages : [ 'foo', 'bar' ] } ] );
} );
