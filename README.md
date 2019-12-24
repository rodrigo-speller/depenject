# depenject

[![Build Status](https://travis-ci.org/rodrigo-speller/depenject.svg?branch=master)](https://travis-ci.org/rodrigo-speller/depenject)
[![Coverage Status](https://coveralls.io/repos/github/rodrigo-speller/depenject/badge.svg?branch=master)](https://coveralls.io/github/rodrigo-speller/depenject?branch=master)
[![npm version](https://badge.fury.io/js/depenject.svg)](https://www.npmjs.com/package/depenject)

# Sample

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
