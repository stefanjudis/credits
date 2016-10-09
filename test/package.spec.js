import test from 'ava';
import { authors, index } from 'all-stars';

import packageUtil from '../lib/package';

test( 'getAuthor - author is a string', t => {
  // only short hand name
  let packageJson1 = {
    author : 'Bob Calsow'
  };

  let author1 = packageUtil.getAuthor( packageJson1 );

  t.deepEqual(
    author1,
    { name : 'Bob Calsow', email : undefined, url : undefined }
  );

  // short hand name and email
  let packageJson2 = {
    author : 'Bob Calsow <bob@calsow.io>'
  };

  let author2 = packageUtil.getAuthor( packageJson2 );

  t.deepEqual(
    author2,
    { name : 'Bob Calsow', email : 'bob@calsow.io', url : undefined }
  );

  // short hand name, email and url
  let packageJson3 = {
    author : 'Bob Calsow <bob@calsow.io> (http://4waisenkinder.de)'
  };

  let author3 = packageUtil.getAuthor( packageJson3 );

  t.deepEqual(
    author3,
    { name : 'Bob Calsow', email : 'bob@calsow.io', url : 'http://4waisenkinder.de' }
  );

  // short hand name and url
  let packageJson4 = {
    author : 'Bob Calsow (http://4waisenkinder.de)'
  };

  let author4 = packageUtil.getAuthor( packageJson4 );

  t.deepEqual(
    author4,
    { name : 'Bob Calsow', email : undefined, url : 'http://4waisenkinder.de' }
  );
} );

test( 'getAuthor - author is an object', t => {
  let packageJson = {
    author : {
      name  : 'Bob Calsow',
      email : 'bob@calsow.io',
      url   : 'http://4waisenkinder.de'
    }
  };

  let author = packageUtil.getAuthor( packageJson );

  t.deepEqual( author, packageJson.author );
} );

test( 'getAuthor - author is not defined', t => {
  let packageJson = {};

  let author = packageUtil.getAuthor( packageJson );

  t.deepEqual( author, false );
} );

test( 'getAuthor - author in all-stars has additional properties', t => {
  let packageJson = {
    author : {
      name  : 'Archimedes of Syracuse',
      email : 'archimedes@syracuse.io',
      url   : 'https://en.wikipedia.org/wiki/Archimedes'
    }
  };

  // add our fake author to all-stars for mocking purposes
  let fakeAuthorId = 'PiDude314159265359';

  authors[ fakeAuthorId ] = {
    npmUsers    : [ fakeAuthorId ],
    names       : [ packageJson.author.name ],
    emails      : [ packageJson.author.email ],
    githubUsers : [ fakeAuthorId ],
    twitters    : [ fakeAuthorId ]
  };

  index[ packageJson.author.name ] = fakeAuthorId;
  index[ packageJson.author.email ] = fakeAuthorId;

  // test
  let author = packageUtil.getAuthor( packageJson );

  t.is( author.name, packageJson.author.name );
  t.is( author.email, packageJson.author.email );
  t.is( author.npm, fakeAuthorId );
  t.is( author.github, fakeAuthorId );
  t.is( author.twitter, fakeAuthorId );
} );


test( 'getMaintainers - maintainers is not defined', t => {
  let packageJson = {
    maintainers : [
      'Bob Calsow <bob@calsow.io> (http://4waisenkinder.de)',
      {
        name  : 'Foo bar',
        email : 'foo@bar.io',
        url   : 'http://foo.bar'
      }
    ]
  };

  let maintainers = packageUtil.getMaintainers( packageJson );

  t.deepEqual(
    maintainers[ 0 ],
    { name : 'Bob Calsow', email : 'bob@calsow.io', url : 'http://4waisenkinder.de' }
  );
  t.deepEqual(
    maintainers[ 1 ],
    { name : 'Foo bar', email : 'foo@bar.io', url : 'http://foo.bar' }
  );
} );

test( 'getMaintainers - maintainers is an invalid string', t => {
  let packageJson = {
    maintainers : 'Bob Calsow <bob@calsow.io> (http://4waisenkinder.de)'
  };

  let maintainers = packageUtil.getMaintainers( packageJson );

  t.deepEqual(
    maintainers[ 0 ],
    { name : 'Bob Calsow', email : 'bob@calsow.io', url : 'http://4waisenkinder.de' }
  );
} );

test( 'getMaintainers - maintainers is not defined', t => {
  let packageJson = {};

  let maintainers = packageUtil.getMaintainers( packageJson );

  t.deepEqual( maintainers, false );
} );
