const request = async (url, option, execute, error) => {
  if (!url || !option) {
    throw new Error('invaild url or option');
  }

  return fetch(url, option)
    .then((response) => response.json())
    .then((data) => {
      if (data.code === 0) {
        execute && execute(data.data);
        return data.data;
      } else {
        error && error(data.message);
        return data.message;
      }
    })
    .catch((err) => {
      console.error('请求发生错误：', err);
      error && error('请求发生错误：' + err);
      return err;
    });
};

class Request {
  get(url, params = {}, execute, error) {
    const keys = Object.keys(params).sort();
    const query = keys.map((k) => `${k}=${params[k]}`).join('&');

    return request(
      query ? `${url}?${query}` : url,
      {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      },
      execute,
      error
    );
  }

  post(url, params = {}, execute, error) {
    const keys = Object.keys(params).sort();
    const query = new URLSearchParams();
    keys.forEach((k) => query.append(k, params[k]));

    return request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: query.toString(),
        credentials: 'include',
        mode: 'cors',
      },
      execute,
      error
    );
  }
}

export default new Request();
