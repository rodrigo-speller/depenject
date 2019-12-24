// Copyright (c) Rodrigo Speller. All rights reserved.
// Licensed under the Apache License, Version 2.0.
// See License.txt in the project root for license information.

import { Container, Tag, DependencyType } from "./abstractions";
import { EntryMap, Entry, SingletonEntry } from "./Entry";
import ContainerBase from "./ContainerBase";

export default class ScopedContainer extends ContainerBase {
  private readonly parent: ContainerBase;

  constructor(parent: ContainerBase, entries: EntryMap)
  {
    super(entries);
    this.parent = parent;
  }

  createScope(): Container {
    return new ScopedContainer(this.parent, this.entries.clone());
  }

  getEntry<T>(arg1: Tag | DependencyType<T>): Entry<T> | undefined {
    let entry = super.getEntry(arg1);

    if (entry == null || entry instanceof SingletonEntry)
      entry = this.parent.getEntry(arg1);

    return entry;
  }
}