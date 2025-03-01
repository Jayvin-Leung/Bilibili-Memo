import request from '@/service/bilibili/request';
import biliUtil from '@/utils/biliUtil';

export const notes = (execute, error) => {
  let url = 'https://api.bilibili.com/x/note/list';
  let params = {
    ps: 50,
    pn: 1,
  };
  return request.get(url, params, execute, error);
};

export const note = (bvid, execute, error) => {
  if (!bvid) return;

  let url = 'https://api.bilibili.com/x/note/list/archive';
  let params = {
    oid: biliUtil.bv2av(bvid),
    oid_type: 0,
  };
  return request.get(url, params, execute, error);
};

export const info = (bvid, noteId, execute, error) => {
  if (!bvid || !noteId) return;

  let url = 'https://api.bilibili.com/x/note/info';
  let params = {
    oid: biliUtil.bv2av(bvid),
    oid_type: 0,
    note_id: noteId,
  };
  return request.get(url, params, execute, error);
};
