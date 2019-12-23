// Copyright (c) Rodrigo Speller. All rights reserved.
// Licensed under the Apache License, Version 2.0.
// See License.txt in the project root for license information.

import {
  Activator,
  DependencyResolver,
  DependencyType
} from '../abstractions'

export interface EntryCtor<T>
{
  new(factory: DependencyType<T> | DependencyResolver<T>): Entry<T>;
};

export default abstract class Entry<T> {
  protected factory: DependencyType<T> | DependencyResolver<T>;

  constructor(factory: DependencyType<T> | DependencyResolver<T>) {
    this.factory = factory;
  }

  abstract resolve(activator: Activator): T;
  abstract clone(): Entry<T>;

  hold(symbol: symbol) {
    (this.factory as any)[symbol] = this;
  }

  release(symbol: symbol) {
    delete (this.factory as any)[symbol];
  }

  static getFromType<T>(type: DependencyType<T>, symbol: symbol): Entry<T> {
    return (type as any)[symbol] as Entry<T>;
  }
}

export { Entry };