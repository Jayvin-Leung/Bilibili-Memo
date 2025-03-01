import { messageModal } from '@/components/modal';
import Request from '@/service/wps/Request';
import {
  backup as backupApi,
  task as taskApi,
  restore as restoreApi,
} from '@/service/wps/api/base';
import plugins from '@/plugins';
import nav from '@/views/toolbar/nav';
import config, { controller } from './config';
import { setTimer, removeTimer } from './job';

class ConfigOutput {
  constructor() {
    this.base = controller.getValue();
    this.plugins = plugins.reduce((acc, curr) => {
      return { ...acc, [curr.id]: curr.config.getValue() };
    }, {});
  }
}

const reload = (data) => {
  const baseConfig = data.base;
  if (baseConfig) {
    controller.setValue(baseConfig);
    controller.useChangeHandler();
  }
  if (data.plugins && Object.keys(data.plugins).length > 0) {
    plugins.forEach((item) => {
      const pluginConfig = data.plugins[item.id];
      if (pluginConfig) {
        item.config.setValue(pluginConfig);
        item.config.useChangeHandler();
        if (item.self.type === 'persistent') item.self.$reset();
      }
    });
  }
  if (data.base || data.plugins) nav.self.$init();
};

export const download = (success) => {
  const _download = (data, filename) => {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  };
  _download(new ConfigOutput(), 'config.json');
  messageModal({ title: '信息', message: '处理中……下载完成后请手动关闭弹窗！' });
  success && success();
};

export const upload = (success) => {
  const _upload = (execute) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;

      if (file.type !== 'application/json') {
        messageModal({
          title: '提示',
          message: '文件格式有误，请选择 .json 后缀格式的文件',
          type: 'warning',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        execute && execute(e.target.result);
      };
      reader.onerror = (e) => {
        console.error('文件读取出错:', e.target.error);
        messageModal({ title: '错误', message: '文件读取出错', type: 'error' });
      };
      reader.readAsText(file);
    });
    input.click();
    input.remove();
  };
  _upload((result) => {
    const data = JSON.parse(result);
    if (data) {
      reload(data);
      messageModal({ title: '成功', message: '配置导入完成', type: 'success' });
    }
  });
  success && success();
};

export const validate = (success, failure) => {
  if (!config.syncAndBackup.wps.isActive) return;
  const condition = 'https://www.kdocs.cn/api/v3/ide/';
  if (!config.syncAndBackup.wps.airScript.webhook.startsWith(condition)) {
    messageModal({
      title: '提示',
      message: 'webhook有误，请仔细检查是否填写正确',
      type: 'warning',
    });
    failure && failure();
    return;
  }

  const request = new Request(
    config.syncAndBackup.wps.airScript.webhook,
    config.syncAndBackup.wps.airScript.token
  );
  request.validate(
    (data) => {
      if (data?.result && data.result.isValid) {
        config.syncAndBackup.wps.airScript.isValid = true;
        controller.useChangeHandler();
      }
      success && success();
    },
    (message) => {
      messageModal({ title: '提示', message, type: 'warning' });
      failure && failure();
    }
  );
};

export const backup = (success, failure) => {
  if (!config.syncAndBackup.wps.isActive) return;
  if (!config.syncAndBackup.wps.airScript.isValid) return;

  const request = new Request(
    config.syncAndBackup.wps.airScript.webhook,
    config.syncAndBackup.wps.airScript.token
  );
  backupApi(
    request,
    new ConfigOutput(),
    (data) => {
      const result = data?.result;
      if (result && result.lastBackupTime && result.lastBackupTime > 0) {
        config.syncAndBackup.wps.backup.lastBackupTime = result.lastBackupTime;
        controller.useChangeHandler();
        messageModal({ title: '成功', message: '备份完成', type: 'success' });
        success && success();
      } else {
        messageModal({ title: '提示', message: '稍后再试', type: 'warning' });
        failure && failure();
      }
    },
    (message) => {
      messageModal({ title: '提示', message, type: 'warning' });
      config.syncAndBackup.wps.airScript.isValid = false;
      controller.useChangeHandler();
      failure && failure();
    }
  );
};

const task = (task_id) => {
  if (!config.syncAndBackup.wps.isActive) return;
  if (!config.syncAndBackup.wps.airScript.isValid) return;
  if (!task_id) return;

  const request = new Request(
    'https://www.kdocs.cn/api/v3/script/task',
    config.syncAndBackup.wps.airScript.token
  );
  taskApi(request, task_id, (data) => {
    const result = data?.result;
    if (result && result.lastBackupTime && result.lastBackupTime > 0) {
      config.syncAndBackup.wps.backup.lastBackupTime = result.lastBackupTime;
      controller.useChangeHandler();
    } else {
      setTimeout(() => {
        task(task_id);
      }, 5000);
    }
  });
};

export const autoBackup = () => {
  if (!config.syncAndBackup.wps.isActive) return;
  if (!config.syncAndBackup.wps.airScript.isValid) return;
  const interval = config.syncAndBackup.wps.backup.autoBackupInterval;
  if (interval <= 0) return;
  const time = config.syncAndBackup.wps.backup.lastBackupTime + interval * 60 * 1000;
  if (time > Date.now()) return;

  const request = new Request(
    config.syncAndBackup.wps.airScript.webhook.replace('sync_task', 'task'),
    config.syncAndBackup.wps.airScript.token
  );
  backupApi(
    request,
    new ConfigOutput(),
    (data) => {
      task(data?.task_id);
    },
    () => {
      config.syncAndBackup.wps.airScript.isValid = false;
      controller.useChangeHandler();
    }
  );
};

export const restore = (success, failure) => {
  if (!config.syncAndBackup.wps.isActive) return;
  if (!config.syncAndBackup.wps.airScript.isValid) return;

  const request = new Request(
    config.syncAndBackup.wps.airScript.webhook,
    config.syncAndBackup.wps.airScript.token
  );
  restoreApi(
    request,
    (data) => {
      if (data?.result) reload(data?.result);
      messageModal({ title: '成功', message: '恢复完成', type: 'success' });
      success && success();
    },
    (message) => {
      messageModal({ title: '提示', message, type: 'warning' });
      config.syncAndBackup.wps.airScript.isValid = false;
      controller.useChangeHandler();
      failure && failure();
    }
  );
};

export const init = () => {
  setTimer(config.syncAndBackup.wps.backup.autoBackupInterval, autoBackup);
};

export const reset = () => {
  removeTimer();
  setTimer(config.syncAndBackup.wps.backup.autoBackupInterval, autoBackup);
};
