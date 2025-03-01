/**
 * 插件展示类
 */
class PluginVO {
  constructor({ id, name, icon, type, isActive, $click }) {
    this.id = id;
    // 插件名称
    this.name = name;
    // 插件图标
    this.icon = icon;
    // 插件类型：immediate | persistent
    this.type = type;
    // 插件状态，对应插件配置
    this.isActive = isActive;
    // 插件的点击事件
    this.$click = $click;
  }
}

export default PluginVO;
