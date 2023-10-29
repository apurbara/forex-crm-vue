export default interface CacheInterface {
  set<ValueType>(key: string, value: ValueType): void;
  get<ValueType>(key: string): ValueType;
  pull<ValueType>(key: string): ValueType;
}
