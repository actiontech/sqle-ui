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

// eslint-disable-next-line import/no-anonymous-default-export
export default new LocalStorageWrapper();
