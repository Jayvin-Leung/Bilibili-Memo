import { createApp, h, ref } from 'vue';
import Antd from 'ant-design-vue';
import biliUtil from '@/utils/biliUtil';
import config, { controller } from './config';
import Badge from './views/Badge.vue';
import Edit from './views/Edit.vue';
import './style.css';

let currPage = (() => {
  const curr = biliUtil.getCurrLocation();
  if (curr === config.base.match[0].replace(/{{uid}}/, biliUtil.getUid())) {
    return 'fav';
  } else if (curr === config.base.match[1].replace(/{{bvid}}/, biliUtil.getCurrBvid())) {
    return 'video';
  } else {
    return '';
  }
})();
let fav = null;
let nodeList = null;
let collection = null;
let appInstances = [];

const insertOrUpdate = (record) => {
  let index = null;
  const result = config.data.find((o, i) => {
    index = i;
    return o.bvid === record.bvid;
  });
  if (!result) {
    config.data.push(record);
  } else {
    config.data.splice(index, 1);
    config.data.splice(index, 0, record);
  }
  controller.useChangeHandler();
};

const unmountApp = () => {
  appInstances.forEach((item) => {
    if (item) item.unmount();
  });
  appInstances = [];
};

const fav_getBvid = (el) => {
  const a = el.querySelector('a:first-child');
  const href = a?.getAttribute('href');
  const path = href?.split('?')[0];
  const temp = path?.split('/video/');
  return temp && temp.length > 1 ? temp[1] : '';
};

const fav_render = () => {
  unmountApp();
  nodeList?.forEach((wrap) => {
    const bvid = fav_getBvid(wrap);
    const result = config.data.find((o) => o.bvid === bvid);
    const target = ref(result || { bvid });
    const app = createApp({
      render: () => {
        return h(Badge, {
          ...target.value,
          onChange: (record) => {
            target.value = record;
            insertOrUpdate(target.value);
          },
        });
      },
    });
    app.use(Antd);
    app.mount(
      (() => {
        let remark = wrap.querySelector('.bili-video-card__remark');
        if (!remark) {
          remark = document.createElement('div');
          remark.classList.add('bili-video-card__remark');
          wrap.appendChild(remark);
        }
        return remark;
      })()
    );
    appInstances.push(app);
  });
};

const fav_remove = () => {
  nodeList?.forEach((wrap) => {
    const remark = wrap.querySelector('.bili-video-card__remark');
    remark && remark.remove();
  });
};

const fav_observer = new MutationObserver((mutations) => {
  let newNodeList = [];
  for (const item of mutations) {
    let wrap = null;
    if (item.target.classList.contains('items')) {
      if (item.addedNodes.length > 0) {
        const items_item = item.addedNodes[0];
        const card = items_item?.querySelector('.bili-video-card');
        wrap = card?.querySelector('.bili-video-card__wrap');
      }
    }
    if (item.target.classList.contains('bili-video-card')) {
      if (item.addedNodes.length > 0) {
        wrap = item.addedNodes[0];
      }
    }
    wrap && newNodeList.push(wrap);
  }
  if (newNodeList.length > 0) {
    nodeList = newNodeList;
    fav_render();
  }
});

const video_getBvid = () => {
  return location.pathname.split('/')[2];
};

const video_render = () => {
  const bvid = video_getBvid();
  if (!collection || !bvid) return;

  unmountApp();

  const result = config.data.find((o) => o.bvid === bvid);
  const target = ref(result || { bvid });
  const app = createApp({
    render: () => {
      return h(Edit, {
        ...target.value,
        onChange: (record) => {
          target.value = record;
        },
      });
    },
  });
  app.use(Antd);
  app.mount(
    (() => {
      let remark = collection.querySelector('.collection__remark');
      if (!remark) {
        const bottom = collection.querySelector('.bottom');
        remark = document.createElement('div');
        remark.classList.add('collection__remark');
        collection.insertBefore(remark, bottom);
        const button = bottom.querySelector('button');
        button &&
          button.addEventListener('click', () => {
            if (!target.value.ctime) {
              target.value.ctime = Date.now();
            }
            target.value.mtime = Date.now();
            insertOrUpdate(target.value);
          });
      }
      return remark;
    })()
  );
  appInstances.push(app);
};

const video_remove = () => {
  const remark = collection?.querySelector('.collection__remark');
  remark && remark.remove();
};

const video_observer = new MutationObserver((mutations) => {
  for (const item of mutations) {
    item.addedNodes.forEach((el) => {
      if (el.classList?.contains('bili-dialog-m')) {
        collection = el.querySelector('.collection-m-exp');
        if (collection) {
          video_render();
          return;
        }
      }
    });
  }
});

const install = () => {
  if (currPage === 'fav') {
    fav = document.querySelector('.fav-list-main > .items');
    nodeList = fav?.querySelectorAll('.bili-video-card__wrap');
    if (nodeList && nodeList.length > 0) fav_render();
    fav_observer.observe(document.body, { childList: true, subtree: true });
  } else if (currPage === 'video') {
    collection = document.querySelector('.bili-dialog-m .collection-m-exp');
    if (collection) video_render();
    video_observer.observe(document.body, { childList: true });
  }
};

const uninstall = () => {
  if (currPage === 'fav') {
    fav_observer.disconnect();
    fav_remove();
    nodeList = null;
    fav = null;
  } else if (currPage === 'video') {
    video_observer.disconnect();
    video_remove();
    collection = null;
  }
};

const toggle = () => {
  if (config.base.isActive) {
    install();
    console.log('开启收藏夹备注功能');
  } else {
    uninstall();
    console.log('关闭收藏夹备注功能');
  }
};

export const init = () => {
  toggle();
  console.log('初始化收藏夹备注功能完成');
};

export const reset = () => {
  toggle();
  console.log('重置收藏夹备注功能完成');
};

export const click = () => {
  config.base.isActive = !config.base.isActive;
  toggle();
  controller.useChangeHandler();
  console.log('切换收藏夹备注功能完成');
};
