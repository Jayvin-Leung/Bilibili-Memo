import PluginConfig from '@/entity/PluginConfig';
import ConfigRef from '@/entity/ConfigRef';

const pluginConfig = new PluginConfig({
  base: {
    match: ['https://www.bilibili.com/video/{{bvid}}/'],
    isActive: false,
    isOnlySwitchCurrActive: true,
  },
  option: {},
  data: [],
});
const configRef = new ConfigRef(pluginConfig);

export default configRef._self();

export const controller = configRef.getController();
