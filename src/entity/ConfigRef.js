import { ref, watch } from 'vue';
import _ from '@/utils/objectUtil';
import BaseConfig from './BaseConfig';
import PluginConfig from './PluginConfig';

/**
 * 配置封装类
 */
class ConfigRef {
  constructor(config) {
    if (![BaseConfig, PluginConfig].includes(config.constructor)) {
      throw new Error('param config expect class [BaseConfig, PluginConfig].');
    }
    this._config = ref(config);
    this._changeHandler = null;
    this._listener = { pause: null, resume: null, stop: null };
  }

  _self() {
    return this._config.value;
  }

  initChangeHandler(handler) {
    this._changeHandler = handler;
  }

  useChangeHandler() {
    this._changeHandler && this._changeHandler(this.getValue());
  }

  getValue() {
    return _.cloneDeep(this._config.value);
  }

  setValue(value) {
    _.assignTargetDeep(this._config.value, value);
  }

  /**
   * 监听插件配置变化
   * @param {Function}                execute               插件配置变化时执行的回调函数
   * @param {any}                     execute.params.$0     execute参数1：变化后的新数据
   * @param {any}                     execute.params.$1     execute参数2：变化前的旧数据
   * @param {{realOldValue: boolean}} [option]              可选选项
   * @param {boolean}                 [option.realOldValue] 是否需要返回真正的 oldValue
   */
  listen(execute, option) {
    if (!execute || typeof execute !== 'function') {
      throw new Error('TypeError: execute is not a function');
    }

    // 停止原先的监听器
    this.stopListen();

    if (option && option.realOldValue) {
      let oldValue = _.cloneDeep(this._config.value);
      this._listener = watch(this._config.value, (value) => {
        execute(value, oldValue);
        oldValue = _.cloneDeep(value);
      });
    } else {
      this._listener = watch(this._config.value, (value, oldValue) => {
        execute(value, oldValue);
      });
    }
  }

  pauseListen() {
    this._listener.pause && this._listener.pause();
  }

  resumeListen() {
    this._listener.resume && this._listener.resume();
  }

  stopListen() {
    if (this._listener.stop) {
      this._listener.stop();
      this._listener = { pause: null, resume: null, stop: null };
    }
  }

  getController() {
    return {
      initChangeHandler: (handler) => this.initChangeHandler(handler),
      useChangeHandler: () => this.useChangeHandler(),
      getValue: () => this.getValue(),
      setValue: (value) => this.setValue(value),
      listen: (execute, option) => this.listen(execute, option),
      pauseListen: () => this.pauseListen(),
      resumeListen: () => this.resumeListen(),
      stopListen: () => this.stopListen(),
    };
  }
}

export default ConfigRef;
