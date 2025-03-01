import BaseConfig from '@/entity/BaseConfig';
import ConfigRef from '@/entity/ConfigRef';

const baseConfig = new BaseConfig({
  general: { shortcutMaxShow: 1, shortcutShowMode: 'hover', shortcuts: [] },
  syncAndBackup: {
    wps: {
      isActive: false,
      airScript: {
        token: '',
        webhook: '',
        isValid: false,
      },
      sync: { enabled: false },
      backup: { autoBackupInterval: 0, lastBackupTime: 0, lastRestoreTime: 0 },
    },
  },
});
const configRef = new ConfigRef(baseConfig);

export default configRef._self();

export const controller = configRef.getController();
