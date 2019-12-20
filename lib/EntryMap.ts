import { Tag } from "./abstractions";
import Entry from "./Entry";

export default class EntryMap {
  private bucket: any = {};
  
  public get(tag: Tag): Entry<any> {
    return this.bucket[tag as any];
  }
  
  public set(tag: Tag, entry: Entry<any>) {
    this.bucket[tag as any] = entry;
  }

  public forEach(fn: (tag: Tag, entry: Entry<any>) => any): void {
    let bucket = this.bucket;
    for(let k of Object.getOwnPropertyNames(bucket))
      fn(k, bucket[k]);
    
    for(let k of Object.getOwnPropertySymbols(bucket))
      fn(k, bucket[k]);
  }
}
