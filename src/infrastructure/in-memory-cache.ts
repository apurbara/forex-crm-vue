import CacheInterface from "@/domain/cache-interface";

export default class InMemoryCache implements CacheInterface {
  constructor(protected cache: { [key: string]: any } = {}) {}

  set<ValueType>(key: string, value: ValueType): void {
    this.cache[key] = value;
  }

  get<ValueType>(key: string): ValueType {
    return this.cache[key];
  }

  pull<ValueType>(key: string): ValueType {
    const value = this.cache[key];
    delete this.cache[key];
    return value;
  }
}
