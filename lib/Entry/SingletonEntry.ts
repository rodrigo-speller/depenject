// Copyright (c) Rodrigo Speller. All rights reserved.
// Licensed under the Apache License, Version 2.0.
// See License.txt in the project root for license information.

import { Activator } from "../abstractions";
import Entry from "./Entry";

export default class SingletonEntry<T> extends Entry<T> {
  private instance!: T;
  private activated: boolean = false;

  resolve(activator: Activator) {
    if (!this.activated)
    {
      this.instance = activator.activate(this.factory);
      this.activated = true;
    }
    
    return this.instance;
  }

  clone() : Entry<T> {
    return new SingletonEntry<T>(this.tag, this.factory);
  }
}