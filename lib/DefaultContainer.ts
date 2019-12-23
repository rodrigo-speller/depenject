// Copyright (c) Rodrigo Speller. All rights reserved.
// Licensed under the Apache License, Version 2.0.
// See License.txt in the project root for license information.

import {
  Activator,
  Container,
  DependencyResolver,
  DependencyType,
  Tag,
  resolver
} from './abstractions'
import { Entry, EntryCtor, EntryMap, TransientEntry } from './Entry';
import CircularDependencyError from './Error/CircularDependencyError';

export default class DefaultContainer extends Container {
  private entries = new EntryMap();
  private containerSymbol = Symbol();

  resolve<T>(type: DependencyType<T>): T | undefined;
  resolve<T>(tag: Tag): T | undefined;
  resolve<T>(arg1: Tag | DependencyType<T>): T | undefined {
    return new ContainerResolver(this).resolve(arg1);
  }

  setEntry<T>(tag: Tag, factory: DependencyType<T> | DependencyResolver<T>, lifetime: EntryCtor<T>): Entry<T> {
    let entry: Entry<T> = this.entries.get(tag);

    if (entry != null)
      entry.release(this.containerSymbol);
    
    entry = new lifetime(tag, factory);

    entry.hold(this.containerSymbol);

    this.entries.set(tag, entry);

    return entry;
  }

  getEntry<T>(arg1: Tag | DependencyType<T>): Entry<T> | undefined {
    let entry: Entry<T> | undefined;

    if (arg1 instanceof Function)
    {
      entry = Entry.get(arg1, this.containerSymbol);

      if (entry == null)
        entry = this.setEntry(Symbol(), arg1, TransientEntry);
    }
    else
    {
      entry = this.entries.get(arg1);
    }

    return entry;
  }
  
  clone(): DefaultContainer {
    let result = new DefaultContainer(),
        containerSymbol = result.containerSymbol,
        entries = result.entries;

    this.entries.forEach((tag, entry) => {
      entry = entry.clone();

      entry.hold(containerSymbol);

      entries.set(tag, entry);
    });

    return result;
  }
}

class ContainerResolver implements Activator, Container
{
  private container: DefaultContainer;
  private resolvingTags: Tag[];

  constructor(parent: DefaultContainer, resolvingTags: Tag[] = []) {
    this.container = parent;
    this.resolvingTags = resolvingTags;
  }

  activate<T>(factory: DependencyType<T> | DependencyResolver<T>): T {
    let typeFactory = (<DependencyType<T>>factory)[resolver];

    if (typeFactory != null)
      factory = typeFactory;

    return (<DependencyResolver<T>>factory)(this);
  }

  resolve<T>(type: DependencyType<T>): T | undefined;
  resolve<T>(tag: Tag): T | undefined;
  resolve<T>(arg1: Tag | DependencyType<T>): T | undefined;
  resolve<T>(arg1: Tag | DependencyType<T>): T | undefined {
    let entry = this.container.getEntry(arg1);
    
    if (entry == null)
      return;
    
    let resolvingTags = this.resolvingTags;

    if (resolvingTags.indexOf(entry.tag) >= 0)
      throw new CircularDependencyError();

    return entry.resolve(new ContainerResolver(this.container, [...resolvingTags, entry.tag]));
  }
}