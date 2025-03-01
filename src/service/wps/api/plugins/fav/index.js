export const remarks = (request, bvids, execute, error) => {
  return request && request.post('plugins/fav/list', { bvids }, execute, error);
};

export const addRemark = (request, remark, execute, error) => {
  return request && request.post('plugins/fav/add', { remark }, execute, error);
};

export const updateRemark = (request, remark, execute, error) => {
  return request && request.post('plugins/fav/update', { remark }, execute, error);
};
