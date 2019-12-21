// Copyright (c) Rodrigo Speller. All rights reserved.
// Licensed under the Apache License, Version 2.0.
// See License.txt in the project root for license information.

import TransientEntry from './TransientEntry';
import SingletonEntry from './SingletonEntry';
import {
  Container,
  DependencyType,
  DependencyResolver,
  Tag
} from './abstractions'

import DefaultContainer from './DefaultContainer'
import { EntryCtor } from './Entry';

export default class ContainerBuilder {
  private container = new DefaultContainer();

  private registerInternal<T>(
    arg1: DependencyType<T> | Tag,
    arg2: DependencyType<T> | DependencyResolver<T> | undefined,
    lifetime: EntryCtor<T>
    ): ContainerBuilder
  {
    let tag: Tag,
        factory: DependencyType<T> | DependencyResolver<T>;

    if (arg1 instanceof Function)
    {
      tag = Symbol();
      factory = arg1;
    }
    else if (arg2 instanceof Function)
    {
      tag = arg1;
      factory = arg2;
    }
    else throw new TypeError()

    this.container.setEntry(tag, factory, lifetime)

    return this
  }

  public build(): Container {
    return this.container.clone();
  }

  public register<T>(type: DependencyType<T>): ContainerBuilder;
  public register<T>(tag: Tag, type: DependencyType<T>): ContainerBuilder;
  public register<T>(tag: Tag, factory: DependencyResolver<T>): ContainerBuilder;
  public register<T>(
    arg1: DependencyType<T> | Tag,
    arg2?: DependencyType<T> | DependencyResolver<T>
    ): ContainerBuilder
  {
    return this.registerInternal(arg1, arg2, TransientEntry);
  }
  
  public registerSingleton<T>(type: DependencyType<T>): ContainerBuilder;
  public registerSingleton<T>(tag: Tag, type: DependencyType<T>): ContainerBuilder;
  public registerSingleton<T>(tag: Tag, factory: DependencyResolver<T>): ContainerBuilder;
  public registerSingleton<T>(
    arg1: DependencyType<T> | Tag,
    arg2?: DependencyType<T> | DependencyResolver<T>
    ): ContainerBuilder
  {
    return this.registerInternal(arg1, arg2, SingletonEntry);
  }
}
