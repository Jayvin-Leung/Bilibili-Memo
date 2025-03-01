/**
 * 插件类
 */
class Plugin {
  constructor({ name, description, icon, type, $init, $reset, $click }) {
    // 插件名称
    this.name = name;
    // 插件描述
    this.description = description;
    // 插件图标
    this.icon = icon;
    // 插件类型：immediate | persistent
    this.type = type;
    // 插件初始化事件
    this.$init = $init;
    // 插件重置事件
    this.$reset = $reset;
    // 插件点击事件
    this.$click = $click;
  }
}

export default Plugin;
