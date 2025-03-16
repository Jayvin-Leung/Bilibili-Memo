import { ref, createApp, h } from 'vue';
import Antd from 'ant-design-vue';
import biliUtil from '@/utils/biliUtil';
import { view as viewApi } from '@/service/bilibili/api/video';
import config, { controller } from './config';
import Mask from './views/Mask.vue';
import More from './views/More.vue';
import './style.css';

let currPage = (() => {
  const curr = biliUtil.getCurrLocation();
  if (/^https:\/\/www\.bilibili\.com\/video\/[^/]+\/$/.test(curr)) {
    return 'video';
  } else if (/^https:\/\/www\.bilibili\.com\/list\/[^/]+\/$/.test(curr)) {
    return 'list';
  } else {
    return '';
  }
})();
let video = null;
let loading = null;
let more = null;
let next = null;
let originalBluetoothHandler = null;

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const initVideoPageNext = async () => {
  const result = await viewApi(biliUtil.getCurrBvid());
  if (!result) return;

  let videos = 0;

  if (result.ugc_season) {
    videos = result.ugc_season.sections?.reduce((acc, curr) => {
      acc += curr?.episodes?.reduce((acc2, curr2) => {
        acc2 += curr2?.pages?.length || 0;
        return acc2;
      }, 0);
      return acc;
    }, 0);
  } else {
    videos = result.videos;
  }

  next = () => {
    if (!videos || videos <= 1) return;
    player?.goto(random(1, videos), true);
  };
};

const initListPageNext = async () => {
  const origin = document.querySelector('.action-list-container');
  if (!origin) return;
  const list = origin.querySelector('#playlist-video-action-list');
  if (!list) return;

  let eplist = [];
  const disabledRef = ref(false);
  const messageRef = ref(eplist.length + '个视频可播放');

  const _renderLoading = () => {
    if (loading) return;
    loading = document.createElement('div');
    loading.classList.add('custom-loading');
    loading.style.width = origin.clientWidth + 'px';
    loading.style.height = origin.clientHeight + 'px';
    loading.style.display = 'none';
    origin.parentNode.insertBefore(loading, origin);
    createApp({
      render: () => h(Mask),
    })
      .use(Antd)
      .mount(loading);
  };

  const _showLoading = () => {
    disabledRef.value = true;
    messageRef.value = '加载中…';
    loading && (loading.style.display = '');
  };

  const _hideLoading = (isEnd) => {
    if (isEnd) {
      disabledRef.value = true;
      messageRef.value = '已全部加载，共' + eplist.length + '个视频可播放';
    } else {
      disabledRef.value = false;
      messageRef.value = eplist.length + '个视频可播放';
    }
    loading && (loading.style.display = 'none');
  };

  const _loadElement = (MAX_COUNT = 20) => {
    _showLoading();

    let count = 0;
    let timerId = setInterval(() => {
      const startFlag = list.querySelector('#actionListAheadAnchor');
      const endFlag = list.querySelector('#actionListBehindAnchor');
      if (
        (startFlag?.style?.display === 'none' && endFlag?.style?.display === 'none') ||
        (MAX_COUNT > -1 && count >= MAX_COUNT)
      ) {
        clearInterval(timerId);
        timerId = null;
        const single = '.actionlist-item-inner.singlep-list-item-inner';
        const multip = '.actionlist-item-inner.multip-list-item-inner .multip-list-item';
        eplist = list.querySelectorAll(`${single}, ${multip}`);
        if (eplist && eplist.length > 0) {
          for (const item of eplist) {
            if (
              item.classList.contains('siglep-active') ||
              item.classList.contains('multip-list-item-active')
            ) {
              setTimeout(() => {
                list.scrollTo({
                  top: item.offsetTop,
                  behavior: 'smooth',
                });
                _hideLoading(
                  startFlag?.style?.display === 'none' &&
                    endFlag?.style?.display === 'none'
                );
              }, 10);
              return;
            }
          }
        }
      }

      if (endFlag?.style?.display === '') {
        list.scrollTop += list.scrollHeight;
      } else if (startFlag?.style?.display === '') {
        list.scroll(null, 0);
      }

      count++;
    }, random(300, 600));
  };

  const _renderMore = () => {
    if (more) return;
    more = document.createElement('div');
    more.classList.add('custom-more');
    more.style.marginLeft = origin.clientWidth + 10 + 'px';
    origin.parentNode.insertBefore(more, origin);
    createApp({
      render: () =>
        h(More, {
          disabled: disabledRef.value,
          message: messageRef.value,
          onClick: (key) => {
            _loadElement(key === -1 ? -1 : key * 10);
          },
        }),
    })
      .use(Antd)
      .mount(more);
  };

  const _render = () => {
    _renderLoading();
    _renderMore();
  };

  _render();
  _loadElement();

  next = () => {
    if (!eplist || eplist.length <= 0) return;
    const target = eplist[random(0, eplist.length - 1)];
    if (!target) return;
    if (target.classList.contains('multip-list-item')) {
      target.parentElement.style.display = '';
    }
    target.click();
    setTimeout(() => {
      list.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth',
      });
    }, random(10, 200));
  };
};

const initNext = async () => {
  if (currPage === 'video') {
    initVideoPageNext();
  } else if (currPage === 'list') {
    initListPageNext();
  }
};

const handler = () => {
  next && next();
};

const buttonHandler = (event) => {
  event.preventDefault();
  event.stopPropagation();
  handler();
};

const observer = new MutationObserver((mutations) => {
  for (const item of mutations) {
    if (item.target.classList.contains('bpx-player-control-bottom-left')) {
      if (item.addedNodes.length > 0) {
        const button = item.addedNodes[0];
        if (button.classList.contains('bpx-player-ctrl-next')) {
          button.addEventListener('click', buttonHandler);
        }
      }
    }
  }
});

const keydownHandler = (event) => {
  if (event.key === ']') {
    event.preventDefault();
    handler();
  }
};

const bluetoothHandler = () => {
  handler();
};

const install = async () => {
  video = document.querySelector('#bilibili-player video');
  if (!video) return;
  initNext();

  // 下一集自动播放事件
  video?.addEventListener('ended', handler);

  // 下一集按钮事件
  observer.observe(document.body, { childList: true, subtree: true });
  document
    .querySelector('.bpx-player-ctrl-next')
    ?.addEventListener('click', buttonHandler);

  // 下一集快捷键事件
  document.addEventListener('keydown', keydownHandler);

  // 下一集蓝牙事件
  if (!navigator.mediaSession?.setActionHandler) return;
  originalBluetoothHandler = navigator.mediaSession.setActionHandler;
  navigator.mediaSession.setActionHandler = function ($0, $1) {
    if ($0 === 'nexttrack' && $1 !== bluetoothHandler) $1 = bluetoothHandler;
    originalBluetoothHandler.call(this, $0, $1);
  };
  navigator.mediaSession.setActionHandler('nexttrack', bluetoothHandler);
};

const uninstall = () => {
  // 下一集蓝牙事件
  if (navigator.mediaSession?.setActionHandler && originalBluetoothHandler) {
    navigator.mediaSession.setActionHandler = originalBluetoothHandler;
    originalBluetoothHandler = null;
    navigator.mediaSession.setActionHandler('nexttrack', () => player?.next());
  }

  // 下一集快捷键事件
  document.removeEventListener('keydown', keydownHandler);

  // 下一集按钮事件
  document
    .querySelector('.bpx-player-ctrl-next')
    ?.removeEventListener('click', buttonHandler);
  observer.disconnect();

  // 下一集自动播放事件
  video?.removeEventListener('ended', handler);

  next = null;
  more && more.parentNode.removeChild(more) && (more = null);
  loading && loading.parentNode.removeChild(loading) && (loading = null);
  video = null;
};

const toggle = () => {
  if (config.base.isActive) {
    install();
    console.log('开启列表随机播放功能');
  } else {
    uninstall();
    console.log('关闭列表随机播放功能');
  }
};

export const init = () => {
  toggle();
  console.log('初始化列表随机播放功能完成');
};

export const reset = () => {
  toggle();
  console.log('重置列表随机播放功能完成');
};

export const click = () => {
  config.base.isActive = !config.base.isActive;
  toggle();
  controller.useChangeHandler();
  console.log('切换列表随机播放功能完成');
};
