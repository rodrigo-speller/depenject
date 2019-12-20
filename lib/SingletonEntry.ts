import { Activator } from "./abstractions";
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
    return new SingletonEntry<T>(this.factory);
  }
}