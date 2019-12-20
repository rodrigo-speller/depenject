import {
  Activator,
  DependencyResolver,
  DependencyType
} from './abstractions'

export interface EntryCtor<T>
{
  new(factory: DependencyType<T> | DependencyResolver<T>): Entry<T>;
};

export default abstract class Entry<T> {
  protected factory: DependencyType<T> | DependencyResolver<T>;

  constructor(factory: DependencyType<T> | DependencyResolver<T>) {
    this.factory = factory;
  }

  abstract resolve(activator: Activator): T;
  abstract clone(): Entry<T>;

  hold(symbol: symbol) {
    (this.factory as any)[symbol] = this;
  }

  release(symbol: symbol) {
    delete (this.factory as any)[symbol];
  }
}
