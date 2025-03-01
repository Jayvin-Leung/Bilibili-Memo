import { init, reset } from './main';
import { controller } from './config';

export default { self: { $init: init, $reset: reset }, config: controller };
