[![npm](https://img.shields.io/npm/v/repository-provider.svg)](https://www.npmjs.com/package/repository-provider)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/repository-provider.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/repository-provider)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://secure.travis-ci.org/arlac77/repository-provider.png)](http://travis-ci.org/arlac77/repository-provider)
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

# repository-provider

abstract interface to git repository providers like github bitbucket

# Example

<!-- skip-example -->

```js
import { GithubProvider } from 'repository-provider';

const provider = new GithubProvider({ token: 'xxx' });

const repository = await provider.repository('myuser/myrepo');
const branch = await repository.branch('master');
const files = await branch.list();
```

# Derived Providers

[list by _repository-provider_ keyword](https://www.npmjs.com/browse/keyword/repository-provider)

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [Provider](#provider)
    -   [Parameters](#parameters)
    -   [Properties](#properties)
    -   [repositoryGroup](#repositorygroup)
        -   [Parameters](#parameters-1)
    -   [createRepositoryGroup](#createrepositorygroup)
        -   [Parameters](#parameters-2)
    -   [repository](#repository)
        -   [Parameters](#parameters-3)
    -   [branch](#branch)
        -   [Parameters](#parameters-4)
    -   [repositoryGroupClass](#repositorygroupclass)
    -   [rateLimitReached](#ratelimitreached)
    -   [name](#name)
    -   [provider](#provider-1)
    -   [defaultOptions](#defaultoptions)
    -   [optionsFromEnvironment](#optionsfromenvironment)
        -   [Parameters](#parameters-5)
    -   [options](#options)
        -   [Parameters](#parameters-6)
-   [Branch](#branch-1)
    -   [Parameters](#parameters-7)
    -   [Properties](#properties-1)
-   [defaultOptions](#defaultoptions-1)
-   [defaultOptions](#defaultoptions-2)
-   [defaultOptions](#defaultoptions-3)
-   [OneTimeInititalizer](#onetimeinititalizer)
-   [Owner](#owner)
    -   [Properties](#properties-2)
-   [Repository](#repository-1)
    -   [Parameters](#parameters-8)
    -   [Properties](#properties-3)
-   [description](#description)
-   [description](#description-1)
-   [id](#id)
-   [id](#id-1)
-   [id](#id-2)
-   [PullRequest](#pullrequest)
    -   [Parameters](#parameters-9)
    -   [Properties](#properties-4)
    -   [provider](#provider-2)
    -   [delete](#delete)
    -   [merge](#merge)
    -   [decline](#decline)
-   [title](#title)
-   [body](#body)
-   [state](#state)
-   [locked](#locked)
-   [merged](#merged)
-   [RepositoryGroup](#repositorygroup-1)
    -   [Parameters](#parameters-10)
    -   [Properties](#properties-5)
    -   [repositoryClass](#repositoryclass)
    -   [branchClass](#branchclass)
    -   [contentClass](#contentclass)
    -   [pullRequestClass](#pullrequestclass)
-   [Content](#content)
    -   [Parameters](#parameters-11)
    -   [Properties](#properties-6)
    -   [isDirectory](#isdirectory)
    -   [isFile](#isfile)
    -   [toString](#tostring)
    -   [getReadStream](#getreadstream)
    -   [equals](#equals)
        -   [Parameters](#parameters-12)
-   [emptyContent](#emptycontent)
    -   [Parameters](#parameters-13)
-   [propertiesFromOptions](#propertiesfromoptions)
    -   [Parameters](#parameters-14)

## Provider

**Extends Owner**

Base repository provider acts as a source of repositories

### Parameters

-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

### Properties

-   `repositoryGroups` **[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [RepositoryGroup](#repositorygroup)>** 
-   `config` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

### repositoryGroup

Lookup a repository group

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** of the group
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[RepositoryGroup](#repositorygroup)>** 

### createRepositoryGroup

Create a new repository group

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[RepositoryGroup](#repositorygroup)>** 

### repository

Lookup a repository in the provider and all of its repository groups

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** of the repository
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Repository](#repository)>** 

### branch

Lookup a branch in the provider and all of its repository groups

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** of the branch
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Branch](#branch)>** 

### repositoryGroupClass

Returns **Class** repository group class used by the Provider

### rateLimitReached

Is our rate limit reached.
By default we have no rate limit

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** always false

### name

Deliver the provider name

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** class name by default

### provider

we are our own provider

Returns **[Provider](#provider)** this

### defaultOptions

Default configuration options

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

### optionsFromEnvironment

Extract options suitable for the constructor
form the given set of environment variables

#### Parameters

-   `env` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** undefined if no suitable environment variables have been found

### options

Pepare configuration by mixing together defaultOptions with actual options

#### Parameters

-   `config` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** raw config

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** combined options

## Branch

-   **See: [Repository#addBranch](Repository#addBranch)**

Abstract branch

### Parameters

-   `repository` **[Repository](#repository)** 
-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

### Properties

-   `repository` **[Repository](#repository)** 
-   `provider` **[Provider](#provider)** 
-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## defaultOptions

options

## defaultOptions

options

## defaultOptions

options

## OneTimeInititalizer

enshures that \_initialize() will be called only once

## Owner

Collection of repositories

### Properties

-   `repositories` **[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [Repository](#repository)>** 

## Repository

Abstract repository

### Parameters

-   `owner` **[Owner](#owner)** 
-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** (#branch) will be removed
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.description` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** human readable description
    -   `options.id` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** internal id

### Properties

-   `owner` **[Owner](#owner)** 
-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** without (#branch)
-   `description` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** from options.description
-   `id` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** from options.id
-   `branches` **[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [Branch](#branch)>** 
-   `pullRequests` **[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [PullRequest](#pullrequest)>** 

## description

the description of the repository content.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## description

the description of the repository group.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## id

unique id within the provider.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## id

internal id.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## id

unique id within the provider.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## PullRequest

Abstract pull request
[Repository#addPullRequest](Repository#addPullRequest)

### Parameters

-   `source` **[Branch](#branch)** 
-   `destination` **[Branch](#branch)** 
-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.title` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** 
    -   `options.state` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** 
    -   `options.merged` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** 
    -   `options.locked` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** 

### Properties

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `source` **[Branch](#branch)** 
-   `destination` **[Branch](#branch)** 
-   `title` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** 
-   `state` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** 
-   `merged` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** 
-   `locked` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** 

### provider

Returns **[Provider](#provider)** 

### delete

-   **See: [Repository#deletePullRequest](Repository#deletePullRequest)**

Delete the pull request from the [Repository](#repository).

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### merge

Merge the pull request

### decline

Decline the pull request

## title

the one line description of the pull request.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## body

the description of the pull request.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## state

state of the pull request.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## locked

locked state of the pull request.

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## merged

merged state of the pull request.

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## RepositoryGroup

**Extends Owner**

Abstract repository as a collection

### Parameters

-   `provider` **[Provider](#provider)** 
-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** of the group
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.description` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** human readable description
    -   `options.id` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** internal id

### Properties

-   `provider` **[Provider](#provider)** 
-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### repositoryClass

By default we use the providers implementation.

Returns **Class** as defined in the provider

### branchClass

By default we use the providers implementation.

Returns **Class** as defined in the provider

### contentClass

By default we use the providers implementation.

Returns **Class** as defined in the provider

### pullRequestClass

By default we use the providers implementation.

Returns **Class** as defined in the provider

## Content

Representation of one file or directory entry
All paths are asolute (no leading '/') and build with '/'

### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** file name inside of the repository
-   `content` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Buffer](https://nodejs.org/api/buffer.html) \| [Stream](https://nodejs.org/api/stream.html))**  (optional, default `undefined`)
-   `type` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** type of the content (optional, default `Content.TYPE_BLOB`)
-   `mode` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** file permissions (optional, default `"100644"`)
-   `sha` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** sha of the content

### Properties

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** file name inside of the repository
-   `content` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Buffer](https://nodejs.org/api/buffer.html) \| [Stream](https://nodejs.org/api/stream.html))** 
-   `type` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** type of the content
-   `mode` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** file permissions
-   `sha` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** sha of the content

### isDirectory

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if content represents a directory

### isFile

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if content represents a blob (plain old file)

### toString

Deliver content as string

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** content

### getReadStream

Deliver content as stream

Returns **ReadableStream** content

### equals

compare against other content

#### Parameters

-   `other` **[Content](#content)** 

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if other describes the same content

## emptyContent

Create empty content (file)

### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `options`  

Returns **[Content](#content)** 

## propertiesFromOptions

-   **See: Object.definedProperties()**

create properties from options and default options

### Parameters

-   `properties` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** where the properties will be stored
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `defaultOptions` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

# install

With [npm](http://npmjs.org) do:

```shell
npm install repository-provider
```

# license

BSD-2-Clause
