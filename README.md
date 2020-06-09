[![npm](https://img.shields.io/npm/v/repository-provider.svg)](https://www.npmjs.com/package/repository-provider)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![minified size](https://badgen.net/bundlephobia/min/repository-provider)](https://bundlephobia.com/result?p=repository-provider)
[![downloads](http://img.shields.io/npm/dm/repository-provider.svg?style=flat-square)](https://npmjs.org/package/repository-provider)
[![Build Status](https://travis-ci.com/arlac77/repository-provider.svg?branch=master)](https://travis-ci.com/arlac77/repository-provider)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/repository-provider.git)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/repository-provider/badge.svg)](https://snyk.io/test/github/arlac77/repository-provider)
[![codecov.io](http://codecov.io/github/arlac77/repository-provider/coverage.svg?branch=master)](http://codecov.io/github/arlac77/repository-provider?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/repository-provider/badge.svg)](https://coveralls.io/r/arlac77/repository-provider)

# repository-provider

abstract interface to git repository providers like github, bitbucket, gitlab, gitea, ...

see list of avaliable implementations below

# Example

<!-- skip-example -->

```es6
import { Provider } from 'repository-provider';

const provider = new Provider({ token: 'xxx' });

const branch = await provider.branch('myuser/myrepo#myBranch');

for await (const entry of branch.entries('**/*.md')) {
  console.log(entry.name);
}

const readme = await branch.entry('README.md');

console.log(await readme.getString());
```

# Derived Providers

[list by _repository-provider_ keyword](https://www.npmjs.com/browse/keyword/repository-provider)

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [Provider](#provider)
    -   [Parameters](#parameters)
    -   [Properties](#properties)
    -   [equals](#equals)
        -   [Parameters](#parameters-1)
    -   [repositoryGroup](#repositorygroup)
        -   [Parameters](#parameters-2)
    -   [createRepositoryGroup](#createrepositorygroup)
        -   [Parameters](#parameters-3)
    -   [addRepositoryGroup](#addrepositorygroup)
        -   [Parameters](#parameters-4)
    -   [repositoryBases](#repositorybases)
    -   [normalizeRepositoryName](#normalizerepositoryname)
        -   [Parameters](#parameters-5)
    -   [parseName](#parsename)
        -   [Parameters](#parameters-6)
    -   [decomposeName](#decomposename)
        -   [Parameters](#parameters-7)
    -   [repository](#repository)
        -   [Parameters](#parameters-8)
    -   [branch](#branch)
        -   [Parameters](#parameters-9)
    -   [repositoryGroups](#repositorygroups)
        -   [Parameters](#parameters-10)
    -   [repositories](#repositories)
        -   [Parameters](#parameters-11)
    -   [branches](#branches)
        -   [Parameters](#parameters-12)
    -   [tags](#tags)
        -   [Parameters](#parameters-13)
    -   [repositoryGroupClass](#repositorygroupclass)
    -   [hookClass](#hookclass)
    -   [name](#name)
    -   [provider](#provider-1)
    -   [toJSON](#tojson)
    -   [optionsFromEnvironment](#optionsfromenvironment)
        -   [Parameters](#parameters-14)
    -   [environmentOptions](#environmentoptions)
    -   [areOptionsSufficciant](#areoptionssufficciant)
        -   [Parameters](#parameters-15)
    -   [initialize](#initialize)
        -   [Parameters](#parameters-16)
-   [priority](#priority)
-   [Owner](#owner)
    -   [Properties](#properties-1)
-   [RepositoryGroup](#repositorygroup-1)
    -   [Parameters](#parameters-17)
    -   [Properties](#properties-2)
    -   [displayName](#displayname)
    -   [repositoryClass](#repositoryclass)
    -   [branchClass](#branchclass)
    -   [contentClass](#contentclass)
    -   [pullRequestClass](#pullrequestclass)
    -   [attributeMapping](#attributemapping)
-   [description](#description)
-   [description](#description-1)
-   [displayName](#displayname-1)
-   [id](#id)
-   [id](#id-1)
-   [id](#id-2)
-   [uuid](#uuid)
-   [uuid](#uuid-1)
-   [type](#type)
-   [url](#url)
-   [avatarURL](#avatarurl)
-   [RepositoryOwnerMixin](#repositoryownermixin)
    -   [Parameters](#parameters-18)
    -   [Properties](#properties-3)
-   [defaultOptions](#defaultoptions)
-   [defaultOptions](#defaultoptions-1)
-   [log](#log)
    -   [Parameters](#parameters-19)
-   [Repository](#repository-1)
    -   [Parameters](#parameters-20)
    -   [Properties](#properties-4)
-   [defaultBranchName](#defaultbranchname)
-   [urls](#urls)
-   [homePageURL](#homepageurl)
-   [issuesURL](#issuesurl)
-   [NamedObject](#namedobject)
    -   [Parameters](#parameters-21)
    -   [Properties](#properties-5)
    -   [equals](#equals-1)
        -   [Parameters](#parameters-22)
    -   [toJSON](#tojson-1)
    -   [defaultOptions](#defaultoptions-2)
    -   [attributeMapping](#attributemapping-1)
-   [Ref](#ref)
    -   [Parameters](#parameters-23)
    -   [equals](#equals-2)
        -   [Parameters](#parameters-24)
    -   [ref](#ref-1)
    -   [refId](#refid)
        -   [Parameters](#parameters-25)
    -   [entries](#entries)
        -   [Parameters](#parameters-26)
    -   [asyncIterator](#asynciterator)
    -   [maybeEntry](#maybeentry)
        -   [Parameters](#parameters-27)
    -   [entry](#entry)
        -   [Parameters](#parameters-28)
    -   [provider](#provider-2)
    -   [owner](#owner-1)
    -   [issuesURL](#issuesurl-1)
    -   [homePageURL](#homepageurl-1)
    -   [isLocked](#islocked)
    -   [isArchived](#isarchived)
    -   [isDisabled](#isdisabled)
    -   [isProtected](#isprotected)
    -   [defaultOptions](#defaultoptions-3)
-   [isProtected](#isprotected-1)
-   [CommitResult](#commitresult)
    -   [Properties](#properties-6)
-   [Branch](#branch-1)
    -   [Parameters](#parameters-29)
    -   [Properties](#properties-7)
    -   [fullName](#fullname)
    -   [fullCondensedName](#fullcondensedname)
    -   [url](#url-1)
    -   [isDefault](#isdefault)
    -   [delete](#delete)
    -   [commit](#commit)
        -   [Parameters](#parameters-30)
    -   [removeEntries](#removeentries)
        -   [Parameters](#parameters-31)
    -   [entryClass](#entryclass)
    -   [createPullRequest](#createpullrequest)
        -   [Parameters](#parameters-32)
    -   [pullRequestClass](#pullrequestclass-1)
    -   [createBranch](#createbranch)
        -   [Parameters](#parameters-33)
-   [PullRequest](#pullrequest)
    -   [Parameters](#parameters-34)
    -   [Properties](#properties-8)
    -   [repository](#repository-2)
    -   [provider](#provider-3)
    -   [equals](#equals-3)
        -   [Parameters](#parameters-35)
    -   [delete](#delete-1)
    -   [merge](#merge)
        -   [Parameters](#parameters-36)
    -   [decline](#decline)
    -   [validStates](#validstates)
    -   [defaultListStates](#defaultliststates)
    -   [validMergeMethods](#validmergemethods)
    -   [list](#list)
        -   [Parameters](#parameters-37)
    -   [open](#open)
        -   [Parameters](#parameters-38)
-   [title](#title)
-   [body](#body)
-   [state](#state)
-   [locked](#locked)
-   [merged](#merged)
-   [Hook](#hook)
    -   [Parameters](#parameters-39)
    -   [Properties](#properties-9)
    -   [equals](#equals-4)
        -   [Parameters](#parameters-40)
    -   [toJSON](#tojson-2)
-   [Milestone](#milestone)
    -   [Parameters](#parameters-41)
-   [definePropertiesFromOptions](#definepropertiesfromoptions)
    -   [Parameters](#parameters-42)
-   [optionJSON](#optionjson)
    -   [Parameters](#parameters-43)
-   [generateBranchName](#generatebranchname)
    -   [Parameters](#parameters-44)
-   [mapAttributes](#mapattributes)
    -   [Parameters](#parameters-45)

## Provider

**Extends Owner**

Base repository provider acts as a source of repositories

### Parameters

-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

### Properties

-   `_repositoryGroups` **[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [RepositoryGroup](#repositorygroup)>** 

### equals

#### Parameters

-   `other`  

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if other provider is the same as the receiver

### repositoryGroup

Lookup a repository group

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** of the group

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[RepositoryGroup](#repositorygroup)>** 

### createRepositoryGroup

Create a new repository group
If there is already a group for the given name it will be returend instead

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** of the group
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[RepositoryGroup](#repositorygroup)>** 

### addRepositoryGroup

Add a new repository group (not provider specific actions are executed)

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** of the group
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[RepositoryGroup](#repositorygroup)** 

### repositoryBases

All possible base urls
For github something like

-   git@github.com
-   git://github.com
-   git+ssh://github.com
-   <https://github.com>
-   git+<https://github.com>

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** common base urls of all repositories

### normalizeRepositoryName

Bring a repository name into its normal form by removing any clutter
like .git suffix or #branch names

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `forLookup` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** normalized name

### parseName

Parses repository name and tries to split it into
base, group, repository and branch

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

### decomposeName

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### repository

Lookup a repository in the provider and all of its repository groups

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** of the repository

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Repository](#repository)>** 

### branch

Lookup a branch in the provider and all of its repository groups

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** of the branch

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Branch](#branch)>** 

### repositoryGroups

List groups

#### Parameters

-   `patterns` **([Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))** 

Returns **Iterator&lt;[RepositoryGroup](#repositorygroup)>** all matching repositories groups of the provider

### repositories

List repositories

#### Parameters

-   `patterns` **([Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))** 

Returns **Iterator&lt;[Repository](#repository)>** all matching repos of the provider

### branches

List branches

#### Parameters

-   `patterns` **([Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))** 

Returns **Iterator&lt;[Branch](#branch)>** all matching branches of the provider

### tags

List tags

#### Parameters

-   `patterns` **([Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))** 

Returns **Iterator&lt;[Branch](#branch)>** all matching tags of the provider

### repositoryGroupClass

Returns **Class** repository group class used by the Provider

### hookClass

Returns **Class** hook class used by the Provider

### name

Deliver the provider name

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** class name by default

### provider

we are our own provider

Returns **[Provider](#provider)** this

### toJSON

list all defined entries from defaultOptions

### optionsFromEnvironment

Extract options suitable for the constructor
form the given set of environment variables

#### Parameters

-   `env` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** taken from process.env

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** undefined if no suitable environment variables have been found

### environmentOptions

Known mapping from environment variable to options

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** with the mapping of environmentvaraible names to option keys

### areOptionsSufficciant

Check if given options are sufficint to create a provider

#### Parameters

-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if options ar sufficiant to construct a provider

### initialize

Creates a new provider for a given set of options

#### Parameters

-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** additional options
-   `env` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** taken from process.env

Returns **[Provider](#provider)** newly created provider or undefined if options are not sufficient to construct a provider

## priority

in case there are several provider able to support a given source which one sould be used ?
this defines the order

## Owner

Collection of repositories

### Properties

-   `repositories` **[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [Repository](#repository)>** 

## RepositoryGroup

**Extends Owner**

Abstract repository collection

### Parameters

-   `provider` **[Provider](#provider)** 
-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** of the group
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.description` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** human readable description
    -   `options.id` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** internal id
    -   `options.uuid` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** internal id
    -   `options.url` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** home

### Properties

-   `provider` **[Provider](#provider)** 
-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### displayName

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** name suitable for humans

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

### attributeMapping

Map attributes between external and internal representation

## description

The description of the repository group.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## description

The description of the repository content.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## displayName

The name suitable for human.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## id

Unique id within the provider.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## id

Unique id within the provider.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## id

internal id.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## uuid

Unique id.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## uuid

Unique id.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## type

Type of the repository group either User or Organization.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## url

Group home.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## avatarURL

Avatar.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## RepositoryOwnerMixin

Collection of repositories

### Parameters

-   `parent`  

### Properties

-   `repositories` **[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [Repository](#repository)>** 

## defaultOptions

options

## defaultOptions

options

## log

Default logger

### Parameters

-   `args` **...any** 

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

## defaultBranchName

The name of the default branch

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## urls

URLs of the repository

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** 

## homePageURL

The url of home page.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## issuesURL

The url of issue tracking system.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## NamedObject

### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `additionaProperties`  

### Properties

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### equals

Check for equality

#### Parameters

-   `other` **[NamedObject](#namedobject)** 

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if names are equal

### toJSON

Provide name and all defined defaultOptions

### defaultOptions

options

### attributeMapping

Map attributes between external and internal representation

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

## Ref

**Extends NamedObject**

Base for Branch and Tag

### Parameters

-   `repository`  
-   `name`  
-   `options`  

### equals

Check for equality

#### Parameters

-   `other` **[Branch](#branch)** 

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if name and repository are equal

### ref

ref name

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** git ref of the Ref

### refId

Get sha of a ref

#### Parameters

-   `ref` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**  (optional, default `this.ref`)

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** sha of the ref

### entries

List entries of the branch

#### Parameters

-   `matchingPatterns` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** 

Returns **Entry** all matching entries in the branch

### asyncIterator

List all entries of the branch

Returns **asyncIterator&lt;Entry>** all entries in the branch

### maybeEntry

Get exactly one matching entry by name or undefine if no such entry is found

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;Entry>** 

### entry

Get exactly one matching entry by name (throws if entry is not found)

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;Entry>** 

### provider

The provider we live in

Returns **[Provider](#provider)** 

### owner

-   **See: [Repository#owner](Repository#owner)
    **

Branch owner
By default we provide the repository owner

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### issuesURL

-   **See: [Repository#issuesURL](Repository#issuesURL)
    **

Url of issue tracking system.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** as provided from the repository

### homePageURL

-   **See: [Repository#homePageURL](Repository#homePageURL)
    **

Url of home page.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** as provided from the repository

### isLocked

forwarded from the repository

### isArchived

forwarded from the repository

### isDisabled

forwarded from the repository

### isProtected

Returns **any** false

### defaultOptions

options

## isProtected

Can the brach be modified.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## CommitResult

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

-   `ref` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## Branch

**Extends Ref**

-   **See: [Repository#\_addBranch](Repository#_addBranch)
    **

Abstract branch

### Parameters

-   `repository` **[Repository](#repository)** 
-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**  (optional, default `"master"`)
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

### Properties

-   `repository` **[Repository](#repository)** 
-   `provider` **[Provider](#provider)** 
-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### fullName

Repository and branch name combined

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 'repo#branch'

### fullCondensedName

Repository fullName and branch name combined.
But skipping the branch name if it is the default branch

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 'user/repo#branch'

### url

Deliver repository and branch url combined

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 'repoUrl#branch'

### isDefault

Are we the default branch

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if name is the repository default branch

### delete

-   **See: [Repository#deleteBranch](Repository#deleteBranch)
    **

Delete the branch from the [Repository](#repository).

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)>** 

### commit

Commit entries

#### Parameters

-   `message` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** commit message
-   `updates` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Entry>** content to be commited
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[CommitResult](#commitresult)** 

### removeEntries

Remove entries form the branch

#### Parameters

-   `entries` **Iterator&lt;Entry>** 

### entryClass

By default we use the providers implementation.

Returns **Class** as defined in the repository

### createPullRequest

Create a pull request

#### Parameters

-   `toBranch` **[Branch](#branch)** 
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[PullRequest](#pullrequest)>** 

### pullRequestClass

By default we use the repository implementation.

Returns **Class** as defined in the repository

### createBranch

Create a new [Branch](#branch) by cloning a given source branch.
Simply calls Repository.createBranch() with the receiver as source branch

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the new branch
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Branch](#branch)>** newly created branch (or already present old one with the same name)

## PullRequest

Abstract pull request
[Repository#addPullRequest](Repository#addPullRequest)

### Parameters

-   `source` **[Branch](#branch)** merge source
-   `destination` **[Branch](#branch)** merge target
-   `number` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.title` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** 
    -   `options.state` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** 
    -   `options.merged` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** 
    -   `options.locked` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** 

### Properties

-   `number` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `source` **[Branch](#branch)** 
-   `destination` **[Branch](#branch)** 
-   `title` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** 
-   `state` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** 
-   `merged` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** 
-   `locked` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** 

### repository

Returns **[Repository](#repository)** destination repository

### provider

Returns **[Provider](#provider)** 

### equals

Check for equality

#### Parameters

-   `other` **[PullRequest](#pullrequest)** 

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if number and repository are equal

### delete

-   **See: [Repository#deletePullRequest](Repository#deletePullRequest)
    **

Delete the pull request from the [Repository](#repository).

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### merge

Merge the pull request

#### Parameters

-   `method` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### decline

Decline the pull request

### validStates

All valid states

Returns **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** valid states

### defaultListStates

States to list pull request by default

Returns **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** states to list by default

### validMergeMethods

All valid merge methods

Returns **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** valid merge methods

### list

List all pull request for a given repo
result will be filtered by source branch, destination branch and states

#### Parameters

-   `repository` **[Repository](#repository)** 
-   `filter` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `filter.source` **[Branch](#branch)?** 
    -   `filter.destination` **[Branch](#branch)?** 
    -   `filter.states` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>?** 

Returns **Iterator&lt;[PullRequest](#pullrequest)>** 

### open

Opens a new pull request

#### Parameters

-   `source` **[Branch](#branch)** 
-   `destination` **[Branch](#branch)** 
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.title` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
    -   `options.body` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[PullRequest](#pullrequest)** 

## title

the one line description of the pull request.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## body

the description of the pull request.

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## state

state of the pull request.

-   OPEN
-   MERGED
-   CLOSED

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## locked

locked state of the pull request.

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## merged

merged state of the pull request.

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## Hook

**Extends NamedObject**

### Parameters

-   `repository`  
-   `name`  
-   `events`   (optional, default `new Set(["*"])`)
-   `options`  

### Properties

-   `repository` **[Repository](#repository)** 
-   `url` **[URL](https://developer.mozilla.org/docs/Web/API/URL/URL)** 
-   `events` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** 

### equals

Check for equality

#### Parameters

-   `other` **[Hook](#hook)** 

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if name and repository are equal

### toJSON

provide name, events and all defined defaultOptions

## Milestone

### Parameters

-   `owner`  
-   `options`  

## definePropertiesFromOptions

-   **See: Object.definedProperties()
    **
-   **See: Object.hasOwnProperty()
    **

Create properties from options and default options
Already present properties (direct) are skipped

### Parameters

-   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** target object
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** as passed to object constructor
-   `properties` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** object properties (optional, default `{}`)

## optionJSON

Create json based on present options.
In other words only produce key value pairs if value is defined.

### Parameters

-   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `initial` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**  (optional, default `{}`)
-   `skip` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** keys not to put in the result (optional, default `[]`)

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** initial + defined values

## generateBranchName

Find a new branch name for a given pattern
'_' will be replaced by a number
'something/_' will get to something/1 something/2 ...

### Parameters

-   `repository` **[Repository](#repository)** 
-   `pattern` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## mapAttributes

Rename attributes.
Filters out null, undefined and empty strings

### Parameters

-   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `mapping` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** keys renamed after mapping

# install

With [npm](http://npmjs.org) do:

```shell
npm install repository-provider
```

# license

BSD-2-Clause
