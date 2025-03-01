/**
 * 基础配置类
 */
class BaseConfig {
  constructor({
    general: { shortcutMaxShow = 1, shortcutShowMode = 'hover', shortcuts = [] },
    syncAndBackup: {
      wps: {
        isActive = false,
        airScript: { token = '', webhook = '', isValid = false },
        sync: { enabled = false },
        backup: { autoBackupInterval = 0, lastBackupTime = 0, lastRestoreTime = 0 },
      },
    },
  }) {
    // 通用设置
    this.general = {
      // 快捷方式栏最大展示数量
      shortcutMaxShow,
      // 快捷方式栏展开方式
      shortcutShowMode,
      // 快捷方式栏插件数组
      shortcuts,
    };
    // 同步&备份设置
    this.syncAndBackup = {
      // WPS 备份设置
      wps: {
        // 是否开启
        isActive,
        // AirScript 配置
        airScript: {
          // AirScript 脚本 APIToken
          token,
          // AirScript 脚本对应 webhook
          webhook,
          // 是否有效
          isValid,
        },
        // 同步设置
        sync: {
          // 开启实时同步
          enabled,
        },
        // 备份设置
        backup: {
          // 自动备份间隔
          autoBackupInterval,
          // 上一次备份数据时间
          lastBackupTime,
          // 上一次恢复数据时间
          lastRestoreTime,
        },
      },
    };
  }
}

export default BaseConfig;
