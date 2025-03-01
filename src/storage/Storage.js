class Storage {
  constructor() {
    if (new.target === Storage) {
      throw new Error('Cannot instantiate an abstract class.');
    }

    Reflect.ownKeys(Storage.prototype).forEach((key) => {
      if (key === 'constructor') return;

      if (
        !new.target.prototype.hasOwnProperty(key) ||
        new.target.prototype[key].length !== Storage.prototype[key].length
      ) {
        throw new Error(`Abstract method ${key} must be implemented.`);
      }
    });
  }

  /**
   * 设置缓存
   * @abstract
   * @param {string} key
   * @param {any}    value
   */
  set(key, value) {
    throw new Error('must be implemented by subclass!');
  }

  /**
   * 判断缓存是否存在
   * @abstract
   * @param {string}    key
   * @returns {boolean}
   */
  has(key) {
    throw new Error('must be implemented by subclass!');
  }

  /**
   * 获取缓存
   * @abstract
   * @param {string} key
   * @param {any}    defaultValue
   * @returns {any}
   */
  get(key, defaultValue) {
    throw new Error('must be implemented by subclass!');
  }

  /**
   * 删除缓存
   * @abstract
   * @param {string} key
   */
  remove(key) {
    throw new Error('must be implemented by subclass!');
  }

  /**
   * 清除缓存
   * @abstract
   */
  clear() {
    throw new Error('must be implemented by subclass!');
  }

  /**
   * 监听缓存变化
   * @abstract
   * @param {string}     key                        需要监听的key
   * @param {Function}   execute                    监听到变化时执行的回调函数
   * @param {{
   *          key: string,
   *          newValue: any,
   *          oldValue: any,
   *        }}           execute.params.$0          execute参数1：{key: string, newValue: any, oldVaule: any}
   * @param {string}     execute.params.$0.key      监听的key
   * @param {any}        execute.params.$0.newValue 变化后的新数据
   * @param {any}        execute.params.$0.oldValue 变化前的旧数据
   * @returns {Function}                            停止监听函数
   */
  listen(key, execute) {
    throw new Error('must be implemented by subclass!');
  }
}

export default Storage;
