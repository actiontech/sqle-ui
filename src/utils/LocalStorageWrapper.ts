class LocalStorageWrapper {
  public set<T extends string = string>(key: string, value: T) {
    return localStorage.setItem(key, value);
  }

  public get(key: string) {
    return localStorage.getItem(key);
  }

  public getOrDefault(key: string, defaultValue: string): string {
    if (localStorage.getItem(key) === null) {
      return defaultValue;
    }
    return localStorage.getItem(key) as string;
  }
}

export default new LocalStorageWrapper();
