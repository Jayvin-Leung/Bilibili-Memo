import { CustomerServiceOutlined } from '@ant-design/icons-vue';
import Plugin from '@/entity/Plugin';
import { init, reset, click } from './main';

export default new Plugin({
  name: '列表随机播放',
  description: '一键开启分p/合集视频的列表随机播放功能，当前页面状态切换不影响其他页面',
  icon: CustomerServiceOutlined,
  type: 'persistent',
  $init: init,
  $reset: reset,
  $click: click,
});
