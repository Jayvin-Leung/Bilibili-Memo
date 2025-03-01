const plugins = [];

const modules = import.meta.glob('./*/index.js', { eager: true });
Object.keys(modules).forEach((path) => {
  const plugin = modules[path].default;
  plugin.id = path.split('/')[1];
  plugin.path = path;
  plugins.push(plugin);
});
plugins.sort((a, b) => a.id?.localeCompare(b.id));
console.log('插件注册完成');

export default plugins;
