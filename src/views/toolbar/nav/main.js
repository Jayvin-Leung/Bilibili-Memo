import { ref } from 'vue';
import PluginVO from '@/entity/PluginVO';
import plugins from '@/plugins';
import menu from '@/views/toolbar/menu';
import config from './config';

const _ = ref([]);

const pluginToPluginVO = (item) => {
  return new PluginVO({
    id: item.id,
    name: item.self.name,
    icon: item.self.icon,
    type: item.self.type,
    isActive: item.config.getValue().base.isActive,
    $click: item.self.$click,
  });
};

const reset = () => {
  config.pluginVOs = [];
  menu.config.getValue().general.shortcuts.forEach((shortcut) => {
    const pluginVO = _.value.find((item) => item.id === shortcut.id && shortcut.isShow);
    if (pluginVO) config.pluginVOs.push(pluginVO);
  });
};

export const init = () => {
  _.value = plugins.map((item) => pluginToPluginVO(item));
  reset();
};

export { reset };

export const switchActive = (pluginId, isActive) => {
  const pluginVO = _.value.find((item) => item.id === pluginId);
  if (!pluginVO) return;
  pluginVO.isActive = isActive;
};
