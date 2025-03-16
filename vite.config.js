import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import monkey, { cdn, util } from 'vite-plugin-monkey';
import path from 'path';
import { name as packageName } from './package.json';

const projectName = packageName
  .split('-')
  .map((item) => {
    return item.charAt(0).toUpperCase() + item.slice(1);
  })
  .join('-');

export default defineConfig({
  define: {
    __PROJECT_NAME__: JSON.stringify(projectName),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
    AutoImport({
      // 自动导入GM api
      imports: [util.unimportPreset],
    }),
    Components({
      // 允许子目录作为组件的命名空间前缀
      directoryAsNamespace: true,
    }),
    monkey({
      entry: 'src/index.js',
      userscript: {
        name: 'B站收藏视频备注+自动备份、视频笔记下载、分p/合集视频随机播放……',
        namespace: 'https://github.com/Jayvin-Leung',
        author: 'Jayvin Leung',
        description:
          '【（1）收藏视频备注功能】：支持在收藏视频时添加备注信息，然后在收藏夹中快速查看和管理备注内容 ；' +
          '【（2）视频笔记下载功能】：支持转换单视频、分p视频、合集视频的私人笔记内容为Markdown文件并下载至本地 ；' +
          '【（3）分p/合集视频列表随机播放功能】：支持单个页面开启/关闭，可自动、点击、快捷键、蓝牙随机切换 ；' +
          '【（4）数据备份、恢复功能】：支持按时间间隔自动备份数据到云端和手动恢复，同时支持导出到本地和导入 ；' +
          '（注意：部分功能仅适配B站新版网页端）',
        license: 'MIT',
        icon: 'https://github.com/user-attachments/assets/b9c1ca07-876b-4fd9-b88e-df10cb29615f',
        homepageURL: `https://github.com/Jayvin-Leung/${projectName}`,
        supportURL: `https://github.com/Jayvin-Leung/${projectName}/issues`,
        match: [
          'https://www.bilibili.com/',
          'https://www.bilibili.com/video/*',
          'https://www.bilibili.com/list/*',
          'https://space.bilibili.com/*/favlist*',
        ],
        require: [
          'https://registry.npmmirror.com/dayjs/1.11.13/files/dayjs.min.js',
          'https://registry.npmmirror.com/dayjs/1.11.13/files/plugin/customParseFormat.js',
          'https://registry.npmmirror.com/dayjs/1.11.13/files/plugin/weekday.js',
          'https://registry.npmmirror.com/dayjs/1.11.13/files/plugin/localeData.js',
          'https://registry.npmmirror.com/dayjs/1.11.13/files/plugin/weekOfYear.js',
          'https://registry.npmmirror.com/dayjs/1.11.13/files/plugin/weekYear.js',
          'https://registry.npmmirror.com/dayjs/1.11.13/files/plugin/advancedFormat.js',
          'https://registry.npmmirror.com/dayjs/1.11.13/files/plugin/quarterOfYear.js',
        ],
        connect: ['kdocs.cn'],
        'run-at': 'document-end',
      },
      build: {
        externalGlobals: {
          vue: cdn.npmmirror('Vue', 'dist/vue.global.prod.js').concat(
            await util.fn2dataUrl(() => {
              window.Vue = Vue;
            })
          ),
          'ant-design-vue': cdn.npmmirror('antd', 'dist/antd.min.js'),
          fflate: cdn.npmmirror('fflate', 'umd/index.js'),
        },
        externalResource: {
          'ant-design-vue/dist/reset.css': cdn.npmmirror(),
        },
      },
    }),
  ],
});
