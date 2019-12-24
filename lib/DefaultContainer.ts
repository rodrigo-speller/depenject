// Copyright (c) Rodrigo Speller. All rights reserved.
// Licensed under the Apache License, Version 2.0.
// See License.txt in the project root for license information.

import {
  Container,
  DependencyResolver,
  DependencyType,
  Tag
} from './abstractions'
import { Entry, EntryCtor } from './Entry';
import ContainerBase from './ContainerBase';
import ScopedContainer from './ScopedContainer';

export default class DefaultContainer extends ContainerBase {
  createScope(): Container {
    return new ScopedContainer(this, this.entries.clone());
  }

  setEntry<T>(tag: Tag, factory: DependencyType<T> | DependencyResolver<T>, lifetime: EntryCtor<T>): Entry<T> {
    let entry: Entry<T> = this.entries.get(tag);

    if (entry != null)
      entry.release(this.containerSymbol);
    
    entry = this.createEntry(tag, factory, lifetime)
    this.entries.set(tag, entry);

    return entry;
  }
  
  clone(): DefaultContainer {
    return new DefaultContainer(this.entries.clone());
  }
}