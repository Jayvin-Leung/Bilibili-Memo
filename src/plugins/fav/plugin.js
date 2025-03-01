import { FolderOutlined } from '@ant-design/icons-vue';
import Plugin from '@/entity/Plugin';
import { init, reset, click } from './main';

export default new Plugin({
  name: '收藏视频备注',
  description: '一键开启收藏夹备注功能，支持在视频页面和收藏夹页面内编辑备注信息',
  icon: FolderOutlined,
  type: 'persistent',
  $init: init,
  $reset: reset,
  $click: click,
});
