const KEY = `${__PROJECT_NAME__}:AUTO_BACKUP_LOCK`;
let timer = null;

const _ = await (async () => {
  const info = await GM.info;
  if (info.scriptHandler === 'Tampermonkey') {
    return async (execute) => {
      const tab = await GM.getTab();
      if (!tab.id) return;
      const tabs = await GM.getTabs();
      if (tab.id !== Object.keys(tabs)[0]) return;
      execute && execute();
    };
  } else {
    return async (execute) => {
      const lock = await GM.getValue(KEY);
      if (!lock || JSON.parse(lock) + 5 * 60 * 1000 < Date.now()) {
        await GM.setValue(KEY, Date.now());
      }
      execute && execute();
      await GM.deleteValue(KEY);
    };
  }
})();

const removeTimer = () => {
  timer && clearInterval(timer);
};

const setTimer = (interval, execute) => {
  removeTimer();
  if (interval > 0) {
    timer = setInterval(() => {
      _ && _(execute);
    }, interval * 0.25 * 60 * 1000);
    _ && _(execute);
  }
};

export { setTimer, removeTimer };
