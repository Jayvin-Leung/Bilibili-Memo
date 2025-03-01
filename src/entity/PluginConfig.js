/**
 * 插件配置类
 */
class PluginConfig {
  constructor({
    base: { match = [], isOnlySwitchCurrActive = false, isActive = false },
    option = {},
    data = [],
  }) {
    // 插件的基础配置
    this.base = {
      // 插件应用的位置，动态信息使用{{x}}表示，默认空数组代表全匹配
      match,
      // 插件是否已激活
      isActive,
      // 插件是否只切换当前页面激活状态
      isOnlySwitchCurrActive,
    };
    // 插件的自定义选项
    this.option = option;
    // 插件运行需要使用到的数据
    this.data = data;
  }
}

export default PluginConfig;
