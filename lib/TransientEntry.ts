import { Activator } from "./abstractions";
import Entry from "./Entry";

export default class TransientEntry<T> extends Entry<T> {
  resolve(activator: Activator) {
    return activator.activate(this.factory);
  }

  clone() {
    return new TransientEntry<T>(this.factory);
  }
}
