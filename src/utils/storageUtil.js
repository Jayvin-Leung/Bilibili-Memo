import storage from '@/storage';
import constants from '@/constants';

export default {
  getAgreement: () => {
    const key = constants.STORAGE_KEY.AGREEMENT;
    return storage.get(key);
  },
  setAgreement: (choice) => {
    const key = constants.STORAGE_KEY.AGREEMENT;
    storage.set(key, choice);
  },
  listenAgreement: (execute) => {
    if (!execute || typeof execute !== 'function') {
      throw new Error('TypeError: execute is not a function');
    }
    const key = constants.STORAGE_KEY.AGREEMENT;
    return storage.listen(key, execute);
  },

  getBaseConfig: () => {
    const key = constants.STORAGE_KEY.BASE_CONFIG;
    return storage.get(key);
  },
  setBaseConfig: (baseConfig) => {
    const key = constants.STORAGE_KEY.BASE_CONFIG;
    storage.set(key, baseConfig);
  },
  listenBaseConfig: (execute) => {
    if (!execute || typeof execute !== 'function') {
      throw new Error('TypeError: execute is not a function');
    }
    const key = constants.STORAGE_KEY.BASE_CONFIG;
    return storage.listen(key, execute);
  },

  getPluginConfig: (id) => {
    if (!id) throw new Error('Error parameter: id.');
    const key = constants.STORAGE_KEY.PLUGIN_CONFIG(id);
    return storage.get(key);
  },
  setPluginConfig: (id, pluginConfig) => {
    if (!id) throw new Error('Error parameter: id.');
    const key = constants.STORAGE_KEY.PLUGIN_CONFIG(id);
    storage.set(key, pluginConfig);
  },
  listenPluginConfig: (id, execute) => {
    if (!id) throw new Error('Error parameter: id.');
    if (!execute || typeof execute !== 'function') {
      throw new Error('TypeError: execute is not a function');
    }
    const key = constants.STORAGE_KEY.PLUGIN_CONFIG(id);
    return storage.listen(key, execute);
  },
};
