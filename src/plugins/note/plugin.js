import { ProfileOutlined } from '@ant-design/icons-vue';
import Plugin from '@/entity/Plugin';
import { init, reset, click } from './main';

export default new Plugin({
  name: '视频笔记下载',
  description: '一键下载视频的分p/合集目录清单及私人笔记内容，进入视频页面后使用',
  icon: ProfileOutlined,
  type: 'immediate',
  $init: init,
  $reset: reset,
  $click: click,
});
