[![npm](https://img.shields.io/npm/v/repository-provider.svg)](https://www.npmjs.com/package/repository-provider)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/repository-provider.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/repository-provider)
[![Build Status](https://secure.travis-ci.org/arlac77/repository-provider.png)](http://travis-ci.org/arlac77/repository-provider)
[![bithound](https://www.bithound.io/github/arlac77/repository-provider/badges/score.svg)](https://www.bithound.io/github/arlac77/repository-provider)
[![codecov.io](http://codecov.io/github/arlac77/repository-provider/coverage.svg?branch=master)](http://codecov.io/github/arlac77/repository-provider?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/repository-provider/badge.svg)](https://coveralls.io/r/arlac77/repository-provider)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/repository-provider/badge.svg)](https://snyk.io/test/github/arlac77/repository-provider)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/repository-provider.svg?style=flat-square)](https://github.com/arlac77/repository-provider/issues)
[![Stories in Ready](https://badge.waffle.io/arlac77/repository-provider.svg?label=ready&title=Ready)](http://waffle.io/arlac77/repository-provider)
[![Dependency Status](https://david-dm.org/arlac77/repository-provider.svg)](https://david-dm.org/arlac77/repository-provider)
[![devDependency Status](https://david-dm.org/arlac77/repository-provider/dev-status.svg)](https://david-dm.org/arlac77/repository-provider#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/repository-provider.svg?branch=master)](http://inch-ci.org/github/arlac77/repository-provider)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![downloads](http://img.shields.io/npm/dm/repository-provider.svg?style=flat-square)](https://npmjs.org/package/repository-provider)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

repository-provider
=====
abstract interface to git repository providers like github bitbucket

Example
====
<!-- skip-example -->
```js
import { GithubProvider } from 'repository-provider';

const provider = new GithubProvider({ token: 'xxx' });

const repository = await provider.repository('myuser/myrepo');
const branch = await repository.branch('master');
const files = await branch.list();

```

API Reference
=====

* <a name="get"></a>

## get() ⇒
**Kind**: global function  
**Returns**: repository class used by the Provider  

* * *

install
=======

With [npm](http://npmjs.org) do:

```shell
npm install repository-provider
```

license
=======

BSD-2-Clause
