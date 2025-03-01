import PluginConfig from '@/entity/PluginConfig';
import ConfigRef from '@/entity/ConfigRef';

const pluginConfig = new PluginConfig({
  base: {
    match: ['https://www.bilibili.com/video/{{bvid}}/'],
    isActive: false,
    isOnlySwitchCurrActive: false,
  },
  option: {
    isOnlyCurr: true,
    catalog: {
      style: 'callout_tasklist',
      newline: '  ',
    },
    title: {
      pattern: 'P{x} 📺 {xxx}',
      level: '##',
    },
    note: {
      mode: 'markdown',
      isExtended: false,
      syntax: {
        newline: '\n',
        bold: '**',
        list: '-',
      },
    },
  },
  data: [],
});
const configRef = new ConfigRef(pluginConfig);

export default configRef._self();

export const controller = configRef.getController();
