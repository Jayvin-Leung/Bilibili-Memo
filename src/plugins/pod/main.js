import config, { controller } from './config';

let video = null;
let pod = null;
let nodeList = null;
let next = null;
let originalBluetoothHandler = null;

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const handler = () => {
  const el = nodeList[random(0, nodeList.length - 1)];
  next && next(el);
};

const buttonHandler = (event) => {
  event.preventDefault();
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

const install = () => {
  video = document.querySelector('#bilibili-player video');
  pod = document.querySelector('.video-pod__list');
  nodeList = document.querySelectorAll('.video-pod__list > div');
  if (!video || !pod || !nodeList || nodeList.length <= 0) return;
  next = (() => {
    if (pod.classList.contains('section')) {
      return (el) => {
        el?.querySelector('.single-p > div')?.click();
      };
    } else {
      return (el) => {
        el?.click();
      };
    }
  })();
  // 下一集自动播放事件
  video?.addEventListener('ended', handler);
  // 下一集按钮事件
  observer.observe(document.body, { childList: true, subtree: true });
  document.querySelector('.bpx-player-ctrl-next')?.addEventListener('click', buttonHandler);
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
  document.querySelector('.bpx-player-ctrl-next')?.removeEventListener('click', buttonHandler);
  observer.disconnect();
  // 下一集自动播放事件
  video?.removeEventListener('ended', handler);
  next = null;
  nodeList = null;
  pod = null;
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
