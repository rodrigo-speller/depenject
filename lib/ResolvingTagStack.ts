// Copyright (c) Rodrigo Speller. All rights reserved.
// Licensed under the Apache License, Version 2.0.
// See License.txt in the project root for license information.

import { Tag } from './abstractions';

export default class ResolvingTagStack
{
  private parent?: ResolvingTagStack;
  private tag?: Tag;

  constructor(tag?: Tag, parent?: ResolvingTagStack)
  {
    this.tag = tag;
    this.parent = parent;
  }

  append(tag: Tag): ResolvingTagStack
  {
    return new ResolvingTagStack(tag, this);
  }

  contains(tag: Tag): boolean
  {
    if (tag == this.tag)
      return true;

    if (this.parent == null)
      return false;

    return this.parent.contains(tag);
  }
}