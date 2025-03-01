import LocalStorage from './LocalStorage';
import GM_Storage from './GM_Storage';

const _ = new GM_Storage();

export default _;

export const factory = {
  create: (type) => {
    switch (type) {
      case 'LocalStorage':
        return new LocalStorage();
      case 'GM_Storage':
        return new GM_Storage();
      default:
        return _;
    }
  },
};
