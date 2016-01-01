import test from 'ava';
import creditUtil from './credit';


test.cb( 'getCredit - email is included', t => {
  let credits = [ { email : 'bob@calsow.io', url : 'http://4waisenkinder.de' } ];

  let credit = creditUtil.getCredit( credits, { email : 'bob@calsow.io' } );

  t.same( credit, { email : 'bob@calsow.io', url : 'http://4waisenkinder.de' } );
  t.end();
} );

test.cb( 'getCredit - only name is included', t => {
  let credits = [ { name : 'Bob Calsow', url : 'http://4waisenkinder.de' } ];

  let credit = creditUtil.getCredit( credits, { name : 'Bob Calsow' } );

  t.same( credit, { name : 'Bob Calsow', url : 'http://4waisenkinder.de' } );
  t.end();
} );

test.cb( 'getCredit - particular credit is not included', t => {
  let credits = [];

  let credit = creditUtil.getCredit( credits, { name : 'Stefan Judis' } );

  t.same( credit, false );
  t.end();
} );


test.cb( 'addCreditToCredits - credit is not included yet', t => {
  let credits = [];

  credits = creditUtil.addCreditToCredits( credits, { name : 'Bob Calsow' }, 'foo' );

  t.same( credits, [ { name : 'Bob Calsow', packages : [ 'foo' ] } ] );
  t.end();
} );

test.cb( 'addCreditToCredits - credit is included', t => {
  let credits = [ { name : 'Bob Calsow', packages : [ 'foo' ] } ];

  credits = creditUtil.addCreditToCredits( credits, { name : 'Bob Calsow' }, 'bar' );

  t.same( credits, [ { name : 'Bob Calsow', packages : [ 'foo', 'bar' ] } ] );
  t.end();
} );
