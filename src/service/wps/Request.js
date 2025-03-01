const request = async (method, webhook, token, data, execute, error) => {
  if (!method || !webhook || !token) {
    throw new Error('invaild method or webhook or token');
  }

  return GM.xmlHttpRequest({
    method,
    url: webhook,
    headers: {
      'Content-Type': 'application/json',
      'AirScript-Token': token,
    },
    data,
    anonymous: true,
    onerror: (response) => {
      console.error('请求发生错误：', response.status, response.statusText);
      error && error('请求发生错误：' + response.status);
      return response.status;
    },
    onload: (response) => {
      if (response.status === 200) {
        const text = JSON.parse(response.responseText);
        execute && execute(text.data);
        return text.data;
      }

      let message = null;
      if (response.status === 404) {
        message = 'webhook有误，请仔细检查是否填写正确';
      } else if (response.status === 403) {
        const text = JSON.parse(response.responseText);
        if (text.result === 'ApiTokenNotExists') {
          message = '脚本令牌有误，请检查令牌是否过期或填写有误';
        } else if (text.result === 'lightLinkNotExist') {
          message = 'webhook不存在，请重新复制并填写';
        } else if (text.result === 'ScriptNotExists') {
          message = '脚本不存在，请先创建脚本';
        } else {
          message = 'webhook有误，请仔细检查是否填写正确';
        }
      } else {
        message = response.statusText;
      }
      error && error(message);
      return message;
    },
  });
};

class Request {
  constructor(webhook, token) {
    this.webhook = webhook;
    this.token = token;
  }

  validate(execute, error) {
    const data = JSON.stringify({
      Context: {
        argv: null,
      },
    });
    return request('POST', this.webhook, this.token, data, execute, error);
  }

  get(params = {}, execute, error) {
    const keys = Object.keys(params).sort();
    const query = keys.map((k) => `${k}=${encodeURIComponent(params[k])}`).join('&');
    if (query) this.webhook = `${this.webhook}?${query}`;
    return request('GET', this.webhook, this.token, null, execute, error);
  }

  post(url, params = {}, execute, error) {
    if (!url || url.split('/').length < 2) {
      throw new Error('invaild url');
    }

    const lastIndex = url.lastIndexOf('/');
    const body = {
      target: url.substring(0, lastIndex),
      action: url.substring(lastIndex + 1),
      params,
    };

    const data = JSON.stringify({
      Context: {
        argv: body,
      },
    });

    return request('POST', this.webhook, this.token, data, execute, error);
  }
}

export default Request;
