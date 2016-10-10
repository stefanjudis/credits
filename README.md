[![Build Status](http://img.shields.io/travis/stefanjudis/credits.svg?style=flat)](https://travis-ci.org/stefanjudis/credits) [![npm version](http://img.shields.io/npm/v/credits.svg?style=flat)](https://www.npmjs.org/package/credits) [![npm downloads](http://img.shields.io/npm/dm/credits.svg?style=flat)](https://www.npmjs.org/package/credits) [![Coverage Status](http://img.shields.io/coveralls/stefanjudis/credits.svg?style=flat)](https://coveralls.io/r/stefanjudis/credits?branch=master) [![Uses greenkeeper.io](https://img.shields.io/badge/Uses-greenkeeper.io-green.svg)](http://greenkeeper.io/)
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors)

# credits

We all use a lot of open source projects. Really often we don't even know who is responsible for all the well done projects. You want to see who to thank for hard work?

**Use `credits` and find out on whose work your projects are based on.**

## Install

```
$ npm i --save credits
```

## Basic usage

`credits` will check `node_modules`, `bower_components`, and `jspm_packages` to evaluate the **Author** and **Maintainers** of the **installed** dependencies included in the set path.

*In case you want to use it over the command line, there is also [credits-cli](https://github.com/stefanjudis/credits-cli).*

### credits( path )

**Description** : Evaluate persons responsible for your dependencies.

`credits` returns a Promise which will be resolved with an Array containing a lot of great people.
*The Array will be sorted according to the numbers of projects they are working on.*

```javascript
var credits    = require( 'credits' );
var creditPath = '/Users/you/your-awesome-project';

/**
 * @param {String} creditPath path to the project you want to analyze
 *
 * @return {Promise}
 */
credits( creditPath )
  .then( function( credits ) {
    console.log( credits );
  } )
  .catch( function( error ) {
    console.log( error );

    process.exit( 1 );
  } );

/*
  Will print:
  {
    npm:
      [ { name     : 'Some person',
          email    : 'some@email.io',
          packages : [ 'package1', 'package2', 'package3', 'package4', 'package5'] },
        { name     : 'Some other great person',
          email    : 'someOther@email.io',
          packages : [ 'package6', 'package7', 'package8' ] },
        ...
        ...
        ...
      ],
    jspm: [...],
    bower: [...]
  }
 */
```

#### I want to thank all these [people](./THANKS.md) for their great work!!!

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/509946?v=3" width="75px;"/><br /><sub>Jayson Harshbarger</sub>](http://www.hypercubed.com)<br />[📖](https://github.com/stefanjudis/credits/commits?author=Hypercubed) [💻](https://github.com/stefanjudis/credits/commits?author=Hypercubed) | [<img src="https://avatars.githubusercontent.com/u/1242621?v=3" width="75px;"/><br /><sub>Radimir Bitsov</sub>](http://radibit.com)<br />[📖](https://github.com/stefanjudis/credits/commits?author=radibit) [💻](https://github.com/stefanjudis/credits/commits?author=radibit) | [<img src="https://avatars.githubusercontent.com/u/112751?v=3" width="75px;"/><br /><sub>Allain Lalonde</sub>](http://stackoverflow.com/users/2443/allain-lalonde)<br />[💻](https://github.com/stefanjudis/credits/commits?author=allain) | [<img src="https://avatars.githubusercontent.com/u/1929625?v=3" width="75px;"/><br /><sub>Andrew Goode</sub>](https://github.com/nexdrew)<br />[💻](https://github.com/stefanjudis/credits/commits?author=nexdrew) |
| :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!