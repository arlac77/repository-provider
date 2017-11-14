
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
