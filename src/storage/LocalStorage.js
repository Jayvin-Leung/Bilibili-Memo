import Storage from './Storage';

class LocalStorage extends Storage {
  constructor() {
    super();
  }

  /** @override */
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /** @override */
  has(key) {
    return localStorage.getItem(key) ? true : false;
  }

  /** @override */
  get(key, defaultValue) {
    let value = localStorage.getItem(key);
    if (!value) return defaultValue;
    return JSON.parse(value);
  }

  /** @override */
  remove(key) {
    localStorage.removeItem(key);
  }

  /** @override */
  clear() {
    localStorage.clear();
  }

  /** @override */
  listen(source, execute) {
    const handler = (e) => {
      if (e.key === source) {
        const newValue = JSON.parse(e.newValue);
        const oldValue = JSON.parse(e.oldValue);
        execute({ key: e.key, newValue, oldValue });
      }
    };
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('storage', handler);
    };
  }
}

export default LocalStorage;
