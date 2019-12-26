// Copyright (c) Rodrigo Speller. All rights reserved.
// Licensed under the Apache License, Version 2.0.
// See License.txt in the project root for license information.

import {
  Activator,
  DependencyResolver,
  DependencyType,
  Tag
} from '../abstractions'

export interface EntryCtor<T>
{
  new(tag: Tag, type: DependencyType<T> | null, factory: DependencyResolver<T>): Entry<T>;
};

export default abstract class Entry<T> {
  readonly tag: Tag;
  
  protected readonly factory: DependencyResolver<T>;
  protected readonly type: DependencyType<T> | null;

  constructor(tag: Tag, type: DependencyType<T> | null, factory: DependencyResolver<T>) {
    this.tag = tag;
    this.type = type;
    this.factory = factory;
  }

  abstract resolve(activator: Activator): T;
  abstract clone(): Entry<T>;

  hold(symbol: symbol) {
    if (this.type != null)
      (this.type as any)[symbol] = this;
  }

  release(symbol: symbol) {
    if (this.type != null)
      delete (this.type as any)[symbol];
  }

  static get<T>(type: DependencyType<T>, symbol: symbol): Entry<T> | undefined {
    return (type as any)[symbol] as Entry<T> | undefined;
  }
}

export { Entry };