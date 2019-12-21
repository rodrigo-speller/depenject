// Copyright (c) Rodrigo Speller. All rights reserved.
// Licensed under the Apache License, Version 2.0.
// See License.txt in the project root for license information.

import { Activator } from "../abstractions";
import Entry from "./Entry";

export default class TransientEntry<T> extends Entry<T> {
  resolve(activator: Activator) {
    return activator.activate(this.factory);
  }

  clone() {
    return new TransientEntry<T>(this.factory);
  }
}
