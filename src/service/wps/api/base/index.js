export const backup = (request, config, execute, error) => {
  return request && request.post('base/backup', { config }, execute, error);
};

export const task = (request, task_id, execute, error) => {
  return request && request.get({ task_id }, execute, error);
};

export const restore = (request, execute, error) => {
  return request && request.post('base/restore', null, execute, error);
};
