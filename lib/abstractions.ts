// Copyright (c) Rodrigo Speller. All rights reserved.
// Licensed under the Apache License, Version 2.0.
// See License.txt in the project root for license information.

export const resolver = Symbol();

export type Tag = string | symbol

interface SimpleDependencyType<T> {
  new(container: Container): T;
}

export interface ComplexDependencyType<T> {
  new(...args: any): T;
  [resolver](container: Container): T;
}

export type DependencyType<T> = SimpleDependencyType<T> | ComplexDependencyType<T>;

export type DependencyResolver<T> = (container: Container) => T;

export interface Activator
{
  activate<T>(factory: DependencyResolver<T>): T;
}

export abstract class Container {
  abstract createScope(): Container;
  abstract resolve<T>(type: DependencyType<T>): T;
  abstract resolve<T>(tag: Tag): T;
}

export function getResolver<T>(type: DependencyType<T>): DependencyResolver<T> {
  let typeFactory = (<ComplexDependencyType<T>>type)[resolver];

  if (typeFactory != null)
    return typeFactory;

  return (container: Container) => new type(container);
}

export function isDependencyType<T>(factory: DependencyType<T> | DependencyResolver<T>): factory is DependencyType<T> {
  return Function.prototype.toString.call(factory).substr(0, 5) == 'class';
}