// Copyright (c) Rodrigo Speller. All rights reserved.
// Licensed under the Apache License, Version 2.0.
// See License.txt in the project root for license information.

import {
  getResolver,
  isClass,
  resolver,
  Activator,
  Container,
  DependencyResolver,
  DependencyType,
  Tag
} from "./abstractions";
import ContainerBase from "./ContainerBase";
import ResolvingTagStack from './ResolvingTagStack'
import CircularDependencyError from "./Error/CircularDependencyError";

export default class ActivatorContainer extends Container implements Activator
{
  private readonly source: ContainerBase;
  private readonly resolvingStack: ResolvingTagStack;

  constructor(source: ContainerBase, resolvingStack: ResolvingTagStack = new ResolvingTagStack()) {
    super();

    this.source = source;
    this.resolvingStack = resolvingStack;
  }

  activate<T>(factory: DependencyType<T> | DependencyResolver<T>): T {
    if (isClass(factory))
      factory = getResolver(factory as DependencyType<T>);

    return (<DependencyResolver<T>>factory)(this);
  }

  createScope(): Container {
    return this.source.createScope();
  }

  resolve<T>(type: DependencyType<T>): T | undefined;
  resolve<T>(tag: Tag): T | undefined;
  resolve<T>(arg1: Tag | DependencyType<T>): T | undefined;
  resolve<T>(arg1: Tag | DependencyType<T>): T | undefined {
    let entry = this.source.getEntry(arg1);

    if (entry == null)
      return;

    let resolvingStack = this.resolvingStack;
    if (resolvingStack.contains(entry.tag))
      throw new CircularDependencyError();

    return entry.resolve(new ActivatorContainer(this.source, resolvingStack.append(entry.tag)));
  }
}