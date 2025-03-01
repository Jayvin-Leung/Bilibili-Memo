import request from '@/service/bilibili/request';

export const favs = (mediaId, execute, error) => {
  if (!mediaId) return;

  let url = 'https://api.bilibili.com/x/v3/fav/resource/list';
  let params = {
    media_id: mediaId,
    ps: 1,
  };
  return request.get(url, params, execute, error);
};
