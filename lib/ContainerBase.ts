// Copyright (c) Rodrigo Speller. All rights reserved.
// Licensed under the Apache License, Version 2.0.
// See License.txt in the project root for license information.

import {
  isDependencyType,
  getResolver,
  Container,
  DependencyType,
  Tag,
  DependencyResolver
} from "./abstractions";
import { EntryMap, Entry, TransientEntry, EntryCtor } from "./Entry";
import ActivatorContainer from "./ActivatorContainer";

export default abstract class ContainerBase extends Container {
  protected readonly containerSymbol = Symbol();
  protected readonly entries: EntryMap;

  constructor(entries: EntryMap = new EntryMap())
  {
    super();

    let containerSymbol = this.containerSymbol;
    entries.forEach((tag, entry) => entry.hold(containerSymbol));

    this.entries = entries;
  }

  getEntry<T>(arg1: Tag | DependencyType<T>): Entry<T> | undefined {
    let entry: Entry<T> | undefined;

    if (arg1 instanceof Function)
    {
      entry = Entry.get(arg1, this.containerSymbol);

      if (entry == null)
      {
        let tag = Symbol();
        entry = this.createEntry(tag, arg1, TransientEntry);
        this.entries.set(tag, entry);
      }
    }
    else
    {
      entry = this.entries.get(arg1);
    }

    return entry;
  }

  createEntry<T>(tag: Tag, factory: DependencyType<T> | DependencyResolver<T>, lifetime: EntryCtor<T>): Entry<T> {
    let entry: Entry<T>;
    if (isDependencyType(factory))
    {
      let type = factory;
      factory = getResolver(type);
      entry = new lifetime(tag, type, factory);
      entry.hold(this.containerSymbol);
    }
    else
    {
      entry = new lifetime(tag, null, factory);
    }

    return entry;
  }

  resolve<T>(type: DependencyType<T>): T | undefined;
  resolve<T>(tag: Tag): T | undefined;
  resolve<T>(arg1: Tag | DependencyType<T>): T | undefined {
    return new ActivatorContainer(this).resolve(arg1);
  }
}