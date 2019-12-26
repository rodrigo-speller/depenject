# depenject

[![Build Status](https://travis-ci.org/rodrigo-speller/depenject.svg?branch=master)](https://travis-ci.org/rodrigo-speller/depenject)
[![Coverage Status](https://coveralls.io/repos/github/rodrigo-speller/depenject/badge.svg?branch=master)](https://coveralls.io/github/rodrigo-speller/depenject?branch=master)
[![npm version](https://badge.fury.io/js/depenject.svg)](https://www.npmjs.com/package/depenject)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/rodrigo-speller/depenject)

**depenject** is a lightweight and fast IoC container to resolve dependencies, achieving Inversion of Control (IoC) between their dependencies.

## Installing

For the latest stable version:

```Shell
npm install depenject
```

## depenject components and extensions

|name|description|version|
|-|-|-|
|[depenject-express](https://github.com/rodrigo-speller/depenject-express)|A middleware for [express](https://expressjs.com/) that provides dependency injection to your requests.|[![npm version](https://badge.fury.io/js/depenject-express.svg)](https://www.npmjs.com/package/depenject-express)|

## Contribute

There are many ways to [contribute](https://github.com/rodrigo-speller/depenject/blob/master/CONTRIBUTING.md) to depenject:

* [Submit bugs](https://github.com/rodrigo-speller/depenject/issues) and help us verify fixes as they are checked in.
* Review the [source code changes](https://github.com/rodrigo-speller/depenject/pulls).
* [Contribute bug fixes](https://github.com/rodrigo-speller/depenject/blob/master/CONTRIBUTING.md).
<!--
* Engage with other depenject users and developers on [StackOverflow](https://stackoverflow.com/questions/tagged/depenject).
-->
<!--
* Join the [#depenject](https://twitter.com/search?q=%23depenject) discussion on Twitter.
-->

## Documentation

*  [Overview of dependency injection with depenject](docs/OVERVIEW.md)

## Building

In order to build the depenject, ensure that you have [Git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/) installed.

Clone a copy of the repo:

```Shell
git clone https://github.com/rodrigo-speller/depenject.git
```

Change to the depenject directory:

```Shell
cd depenject
```

Install tools and dev dependencies:

```Shell
npm install
```

Use one of the following to build and test:

```
npm run build       # Build the library into "dist" directory.
npm run test        # Test the library code.
npm run coverage    # Generates the coverage from the tests.
```

## A simple sample to copy-and-paste

```typescript
// name-provider.ts

import { resolver } from 'depenject';

export default class NameProvider {
  public name: string = "World";

  static [resolver]() {
    return new NameProvider();
  }
}
```

```typescript
// hello-service.ts

import { Container, resolver } from 'depenject';

import NameProvider from './name-provider';

export default class HelloService {
  private nameProvider: NameProvider;

  constructor(nameProvider: NameProvider) {
    this.nameProvider = nameProvider;
  }

  static [resolver](container: Container) {
    return new HelloService(container.resolve(NameProvider));
  }

  sayHello() {
    console.log("Hello " + this.nameProvider.name + "!");
  }
}
```

```typescript
// hello.ts

import { Container, ContainerBuilder, resolver } from 'depenject';
import NameProvider from './name-provider';
import HelloService from './hello-service';

let container = new ContainerBuilder()
  .register(HelloService)
  .registerSingleton(NameProvider)
  .build();

// resolve dependencies

let helloService = container.resolve(HelloService);
let nameProvider = container.resolve(NameProvider);

// execution

helloService.sayHello();
nameProvider.name = "Rodrigo Speller"
helloService.sayHello();
```

The *hello* sample outputs the below text in console:

```
Hello World!
Hello Rodrigo Speller!
```

# License
Copyright 2019 Rodrigo Speller

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
