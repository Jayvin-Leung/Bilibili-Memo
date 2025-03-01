import Storage from './Storage';

class GM_Storage extends Storage {
  constructor() {
    super();
  }

  /** @override */
  set(key, value) {
    GM_setValue(key, value);
  }

  /** @override */
  has(key) {
    return GM_getValue(key, null) ? true : false;
  }

  /** @override */
  get(key, defaultValue) {
    return GM_getValue(key, defaultValue);
  }

  /** @override */
  remove(key) {
    GM_deleteValue(key);
  }

  /** @override */
  clear() {
    const keys = GM_listValues();
    keys.forEach((key) => {
      GM_deleteValue(key);
    });
  }

  /** @override */
  listen(key, execute) {
    const listenerId = GM_addValueChangeListener(key, (key, oldValue, newValue) => {
      execute({ key, newValue, oldValue });
    });
    return () => {
      GM_removeValueChangeListener(listenerId);
    };
  }
}

export default GM_Storage;
