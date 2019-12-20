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

export interface Container {
  resolve<T>(type: DependencyType<T>): T;
  resolve<T>(tag: Tag): T;
}
