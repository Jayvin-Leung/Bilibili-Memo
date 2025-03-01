const XOR_CODE = 23442827791579n;
const MASK_CODE = 2251799813685247n;
const MAX_AID = 1n << 51n;
const BASE = 58n;
const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';

const getCookieValue = (key) => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim().split('=');
    if (cookie[0] === key) {
      return cookie.length > 1 ? cookie[1] : '';
    }
  }
  return null;
};

const getUid = () => {
  return getCookieValue('DedeUserID');
};

const getCsrf = () => {
  return getCookieValue('bili_jct');
};

const getCurrLocation = () => {
  const currLocation = location.origin + location.pathname;
  return currLocation.endsWith('/') ? currLocation : currLocation + '/';
};

const getCurrBvid = () => {
  if (location.origin != 'https://www.bilibili.com') return '';
  const arr = location.pathname.split('/');
  if (arr[1] !== 'video') return '';
  if (!new RegExp(/(BV|av)[a-zA-Z0-9]+/).test(arr[2])) return '';
  return arr[2];
};

const av2bv = (aid) => {
  const bytes = ['B', 'V', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
  let bvIndex = bytes.length - 1;
  let tmp = (MAX_AID | BigInt(aid)) ^ XOR_CODE;
  while (tmp > 0) {
    bytes[bvIndex] = data[Number(tmp % BigInt(BASE))];
    tmp = tmp / BASE;
    bvIndex -= 1;
  }
  [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
  [bytes[4], bytes[7]] = [bytes[7], bytes[4]];
  return bytes.join('');
};

const bv2av = (bvid) => {
  const bvidArr = Array.from(bvid);
  [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
  [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
  bvidArr.splice(0, 3);
  const tmp = bvidArr.reduce(
    (pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)),
    0n
  );
  return Number((tmp & MASK_CODE) ^ XOR_CODE);
};

export default {
  getCookieValue,
  getUid,
  getCsrf,
  getCurrLocation,
  getCurrBvid,
  av2bv,
  bv2av,
};
