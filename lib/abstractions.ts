// Copyright (c) Rodrigo Speller. All rights reserved.
// Licensed under the Apache License, Version 2.0.
// See License.txt in the project root for license information.

export const resolver = Symbol();

export type Tag = string | symbol

export interface DependencyType<T> {
  new(...args: any): T;
  [resolver](container: Container): T;
}

export type DependencyResolver<T> = (container: Container) => T;

export interface Activator
{
  activate<T>(factory: DependencyType<T> | DependencyResolver<T>): T;
}

export abstract class Container {
  abstract resolve<T>(type: DependencyType<T>): T;
  abstract resolve<T>(tag: Tag): T;
}
