import storageUtil from '@/utils/storageUtil';
import plugins from '@/plugins';
import menu from './views/toolbar/menu';
import nav from './views/toolbar/nav';

const initPluginConfig = () => {
  plugins.forEach((item) => {
    const cache = storageUtil.getPluginConfig(item.id);
    if (!cache) {
      storageUtil.setPluginConfig(item.id, item.config.getValue());
    } else {
      item.config.setValue(cache);
    }
    item.config.initChangeHandler((config) => {
      storageUtil.setPluginConfig(item.id, config);
      if (item.self.type === 'persistent') {
        nav.self.$switchActive(item.id, config.base.isActive);
      }
    });
    item.self.$init();
  });
};

const initBaseConfig = () => {
  const cache = storageUtil.getBaseConfig();
  if (!cache) {
    const baseConfig = menu.config.getValue();
    plugins.forEach((item) => {
      const shortcut = { id: item.id, name: item.self.name, isShow: true };
      baseConfig.general.shortcuts.push(shortcut);
    });
    storageUtil.setBaseConfig(baseConfig);
  } else {
    menu.config.setValue(cache);
  }
  menu.config.initChangeHandler((config) => {
    storageUtil.setBaseConfig(config);
  });
  menu.self.$init();
};

const initListener = () => {
  let listeners = [];

  listeners.push(
    storageUtil.listenAgreement(({ newValue, oldValue }) => {
      if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return;
      location.reload();
    })
  );

  listeners.push(
    storageUtil.listenBaseConfig(({ newValue }) => {
      const oldValue = menu.config.getValue();
      if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return;
      menu.config.setValue(newValue);
      if (
        newValue.syncAndBackup.wps.backup.autoBackupInterval !==
        oldValue.syncAndBackup.wps.backup.autoBackupInterval
      ) {
        menu.self.$reset();
      }
      nav.self.$reset();
    })
  );

  plugins.forEach((item) => {
    listeners.push(
      storageUtil.listenPluginConfig(item.id, ({ newValue }) => {
        const oldValue = item.config.getValue();
        if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return;
        if (oldValue.base.isOnlySwitchCurrActive) {
          newValue.base.isActive = oldValue.base.isActive;
        }
        item.config.setValue(newValue);
        if (
          item.self.type === 'persistent' &&
          newValue.base.isActive !== oldValue.base.isActive
        ) {
          item.self.$reset();
          nav.self.$switchActive(item.id, newValue.base.isActive);
        }
      })
    );
  });

  return listeners;
};

export const init = () => {
  initPluginConfig();
  initBaseConfig();
  nav.self.$init();
  initListener();
  console.log('初始化完成');
};
