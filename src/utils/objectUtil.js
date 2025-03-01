/**
 * 基于 source 的深分配，改变原目标对象
 * @param {any}    target  目标对象
 * @param {...any} sources 剩余源对象
 * @returns {any}          修改后的目标对象
 * @example
 * // return {a: 1, b: 2, c: 4}
 * assignDeep({a: 1}, {b: 2, c: 3}, {c: 4});
 */
const assignDeep = (target, ...sources) => {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  sources.forEach((source) => {
    if (source !== undefined && source !== null) {
      for (const key in source) {
        target[key] = cloneDeep(source[key]);
      }
    }
  });

  return target;
};

/**
 * 基于 target 的深分配，改变原目标对象
 * @param {any}    target  目标对象
 * @param {...any} sources 剩余源对象
 * @returns {any}          修改后的目标对象
 * @example
 * // return {a: 1, b: 3}
 * assignTargetDeep({a: 1, b: 2}, {b: 3, c: 4}, {c: 5});
 */
const assignTargetDeep = (target, ...sources) => {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  sources.forEach((source) => {
    if (source !== undefined && source !== null) {
      for (const key in target) {
        if (source.hasOwnProperty(key)) {
          target[key] = cloneDeep(source[key]);
        }
      }
    }
  });

  return target;
};

const cloneDeep = (target) => {
  // WeakMap作为记录对象Hash表（用于防止循环引用）
  // WeakMap 实际起到临时缓存的作用，key：被拷贝对象，vulue：拷贝结果
  // 当下次一次拷贝时，发现要拷贝的对象已经在缓存中，说明发生了循环引用
  // 那就直接取出对应的上一次的拷贝结果，并返回
  const map = new WeakMap();

  // 判断是否为object类型的辅助函数，减少重复代码
  const isObject = (t) => {
    // typeof null 也是 object，所以这里使用 `&& t` 排除 null
    return (typeof t === 'object' && t) || typeof t === 'function';
  };

  const clone = (data) => {
    // 基础类型直接返回值
    if (!isObject(data)) {
      return data;
    }

    // 处理函数对象
    if (typeof data === 'function') {
      // eval()或new Function()等动态执行代码的功能时,
      // 如果浏览器启用了严格的内容安全策略（Content Security Policy，CSP），
      // 并且策略中禁止了'unsafe-eval'，则会抛出错误 Uncaught EvalError
      try {
        // 尝试捕获 Uncaught EvalError 错误，但好像没用
        // return new Function('return ' + data.toString())();
        // 函数复制了会有一堆问题，直接返回引用算了
        return data;
      } catch (error) {
        // 如果不允许则直接返回，structuredClone 和 lodash 都没能解决函数深拷贝的问题，无需纠结
        return data;
      }
    }

    // 判断是否为循环引用，是则直接退出，没有往下进行判断的需要
    // 如果该对象已存在，则直接返回该对象
    if (map.has(data)) {
      return map.get(data);
    }

    // 日期或者正则对象则直接构造一个新的对象返回
    if ([Date, RegExp].includes(data.constructor)) {
      return new data.constructor(data);
    }

    // 处理Map对象
    if (data.constructor === Map) {
      const result = new Map();
      map.set(data, result);
      data.forEach((val, key) => {
        // 注意：map中的值为object的话也得深拷贝
        if (isObject(val)) {
          result.set(key, clone(val));
        } else {
          result.set(key, val);
        }
      });
      return result;
    }

    // 处理Set对象
    if (data.constructor === Set) {
      const result = new Set();
      map.set(data, result);
      data.forEach((val) => {
        // 注意：set中的值为object的话也得深拷贝
        if (isObject(val)) {
          result.add(clone(val));
        } else {
          result.add(val);
        }
      });
      return result;
    }

    // 处理数组
    if (Array.isArray(data)) {
      const result = [];
      map.set(data, result);
      data.forEach((val, index) => {
        // 注意：数组中的值为object的话也得深拷贝
        if (isObject(val)) {
          result[index] = clone(val);
        } else {
          result[index] = val;
        }
      });
      return result;
    }

    // 收集键名（考虑了以Symbol作为key以及不可枚举的属性）
    const keys = Reflect.ownKeys(data);
    // 利用 Object 的 getOwnPropertyDescriptors 方法可以获得对象的所有属性以及对应的属性描述
    const allDesc = Object.getOwnPropertyDescriptors(data);
    // 结合 Object 的 create 方法创建一个新对象，并继承传入原对象的原型链， 这里得到的result是对data的浅拷贝
    const result = Object.create(Object.getPrototypeOf(data), allDesc);

    // 新对象加入到map中，进行记录
    map.set(data, result);

    // Object.create()是浅拷贝，所以要判断并递归执行深拷贝
    keys.forEach((key) => {
      const val = data[key];
      // 属性值为 对象类型 或 函数对象 的话也需要进行深拷贝
      if (isObject(val)) {
        result[key] = clone(val);
      } else {
        result[key] = val;
      }
    });

    return result;
  };

  return clone(target);
};

export default { assignDeep, assignTargetDeep, cloneDeep };
