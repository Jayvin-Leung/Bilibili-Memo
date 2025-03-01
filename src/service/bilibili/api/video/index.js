import request from '@/service/bilibili/request';

export const view = (bvid, execute, error) => {
  if (!bvid) return;

  let url = 'https://api.bilibili.com/x/web-interface/view';
  let params = {
    bvid,
  };
  return request.get(url, params, execute, error);
};
