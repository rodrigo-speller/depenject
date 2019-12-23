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
import { Entry, EntryCtor, EntryMap } from './Entry';

export default class DefaultContainer extends Container implements Activator {
  private entries = new EntryMap();
  private containerSymbol = Symbol();

  resolve<T>(type: DependencyType<T>): T | undefined;
  resolve<T>(tag: Tag): T | undefined;
  resolve<T>(arg1: Tag | DependencyType<T>): T | undefined {
    let entry: Entry<T>;

    if (arg1 instanceof Function)
    {
      entry = Entry.get(arg1, this.containerSymbol);

      if (entry == null)
        return this.activate(arg1);
    }
    else
    {
      entry = this.entries.get(arg1);
      
      if (entry == null)
        return;
    }

    return entry.resolve(this);
  }

  activate<T>(factory: DependencyType<T> | DependencyResolver<T>): T {
    let typeFactory = (<DependencyType<T>>factory)[resolver];

    if (typeFactory != null)
      factory = typeFactory;

    return (<DependencyResolver<T>>factory)(this);
  }

  setEntry<T>(tag: Tag, factory: DependencyType<T> | DependencyResolver<T>, lifetime: EntryCtor<T>): void {
    let entry: Entry<T> = this.entries.get(tag);

    if (entry != null)
      entry.release(this.containerSymbol);
    
    entry = new lifetime(factory);

    entry.hold(this.containerSymbol);

    this.entries.set(tag, entry);
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
