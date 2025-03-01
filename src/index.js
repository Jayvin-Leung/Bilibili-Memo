import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue';
import './style.css';
import { init } from './main';
import { register } from './register';

await register();
init();
/*
  使用全局导入Antd的方案时，
  必须确保createApp()后接.use(Antd)，
  否则新创建的应用实例中无法正确渲染antd组件
 */
createApp(App)
  .use(Antd)
  .mount(
    (() => {
      const app = document.createElement('div');
      document.body.append(app);
      return app;
    })()
  );
