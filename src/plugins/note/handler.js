import dateUtil from '@/utils/dateUtil';
import config from './config';

const reg = /[\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/]/g;

export const fileNameHandler = (fileName) => {
  return fileName.replace(/[\\\/\:\*\?\"\<\>\|]/g, '');
};

export const pageTitleHandler = (p, title) => {
  title = title.replace(reg, '\\$&');
  return config.option.title.pattern
    ? config.option.title.pattern.replace(/{x}/g, p).replace(/{xxx}/g, title)
    : title;
};

const mdOutlink = (fileName) => {
  const ascll = /[\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/ ]/g;
  const encode = ($0) => {
    return !['(', ')'].includes($0) ? encodeURI($0) : $0 == '(' ? '%28' : '%29';
  };
  const mdDisplayReg = { r: /(\[\])/g, $: '\\$1' };
  const mdLinkReg = { r: ascll, $: encode };
  return {
    display: fileName.replace(mdDisplayReg.r, mdDisplayReg.$),
    link: fileName.replace(mdLinkReg.r, mdLinkReg.$),
  };
};

const wikiOutlink = (fileName) => {
  const wikiDisplayReg = { r: /(\[\])/g, $: ' $1' };
  const wikiLinkReg = { r: /[\#\^\|\\]/g, $: ' ' };
  return {
    display: fileName.replace(wikiDisplayReg.r, wikiDisplayReg.$),
    link: fileName.replace(wikiLinkReg.r, wikiLinkReg.$),
  };
};

export const episodeOutlinkHandler = (fileName) => {
  const md = mdOutlink(fileName);
  const wiki = wikiOutlink(fileName);
  return config.option.note.mode === 'obsidian'
    ? `[[${wiki.link}|${wiki.display}]]`
    : `[${md.display}](${md.link})`;
};

export const pageOutlinkHandler = (fileName) => {
  return (title) => {
    const md = mdOutlink(title);
    const wiki = wikiOutlink(title);
    return config.option.note.mode === 'obsidian'
      ? `[[${fileName}#${wiki.link}|${wiki.display}]]`
      : `[${md.display}](${mdOutlink(fileName).link}#${md.link})`;
  };
};

export const textHandler = () => {
  let indentLevel = [];
  const isExtended = config.option.note.isExtended;
  const rank = (() => {
    if (isExtended) {
      return [
        { name: 'underline', start: '<u>', end: '</u>', sort: 0 },
        { name: 'strike', start: '<s>', end: '</s>', sort: 1 },
        { name: 'bold', start: '<b>', end: '</b>', sort: 2 },
        { name: 'background', start: '<span>', end: '</span>', sort: 3 },
        { name: 'color', start: '<span>', end: '</span>', sort: 3 },
        { name: 'size', start: '<span>', end: '</span>', sort: 3 },
      ];
    } else {
      let temp = config.option.note.syntax.bold;
      if (config.option.note.mode === 'obsidian') {
        return [
          { name: 'bold', start: temp, end: temp, sort: 0 },
          { name: 'strike', start: '~~', end: '~~', sort: 1 },
          { name: 'background', start: '==', end: '==', sort: 2 },
        ];
      } else {
        return [{ name: 'bold', start: temp, end: temp }];
      }
    }
  })();

  const cross = (obj1, obj2) => {
    if (!obj1 || !obj2) return {};
    const result = {};

    for (const key in obj1) {
      if (isExtended) {
        if (obj2.hasOwnProperty(key) && obj1[key] === obj2[key]) {
          result[key] = obj1[key];
        }
      } else {
        if (obj2.hasOwnProperty(key)) {
          result[key] = obj1[key];
        }
      }
    }

    return result;
  };

  const diff = (target, pattern) => {
    if (!target) return {};
    const result = {};

    for (const key in target) {
      if (!pattern.hasOwnProperty(key)) {
        result[key] = target[key];
      }
    }

    return result;
  };

  const suffix = (tagStack, closedTags, open, close) => {
    let max = 0;

    let keyArr = Object.keys(open);
    if (keyArr.length > 0) {
      keyArr.forEach((key) => {
        const target = rank.find((item) => item.name === key);
        if (target && target.sort > max) max = target.sort;
      });
    }

    keyArr = Object.keys(close);
    if (keyArr.length > 0) {
      keyArr.forEach((key) => {
        let index = -1;
        const target = tagStack.find((item, i) => {
          if (item.name === key) {
            index = i;
            return item;
          }
        });
        if (index > -1) {
          closedTags.push(...tagStack.splice(index, 1));
          if (target.sort > max) max = target.sort;
        }
      });
    }

    if (isExtended) {
      closedTags.push(...tagStack.filter((item) => item.sort <= max));
    } else {
      closedTags.push(...tagStack.filter((item) => item.sort < max));
    }

    return closedTags.length > 0
      ? closedTags
          .reduce((acc, curr) => {
            if (!acc.find((item) => item.sort === curr.sort)) acc.push({ ...curr });
            return acc;
          }, [])
          .sort((a, b) => a.sort - b.sort)
          .map((item) => item.end)
          .join('')
      : '';
  };

  const prefix = (tagStack, closedTags, same, open) => {
    const skip = [];

    let keyArr = Object.keys(same);
    if (keyArr.length > 0) {
      keyArr.forEach((key) => {
        if (!closedTags.find((item) => item.name === key)) skip.push(key);
      });
    }

    keyArr = Object.keys(open);
    if (keyArr.length > 0) {
      keyArr.forEach((key) => {
        let target = rank.find((item) => item.name === key);
        if (target) {
          if (isExtended && target.sort === 3) {
            const styleName = target.name === 'size' ? 'font-size' : target.name;
            if (same.hasOwnProperty(target.name)) {
              target.start = `${styleName}: ${same[target.name]}`;
            }
            if (open.hasOwnProperty(target.name)) {
              target.start = `${styleName}: ${open[target.name]}`;
            }
          }
          tagStack.push(target);
        }
      });
    }

    return tagStack.length > 0
      ? tagStack
          .reduce((acc, curr) => {
            if (!skip.includes(curr.name)) {
              const target = acc.find((item) => item.sort === curr.sort);
              if (target && isExtended && target.sort === 3) {
                target.name += `,${curr.name}`;
                target.start += `;${curr.start}`;
              } else {
                acc.push({ ...curr });
              }
            }
            return acc;
          }, [])
          .sort((a, b) => b.sort - a.sort)
          .map((item) => {
            if (isExtended && item.sort === 3) {
              item.start = `<span style="${item.start}">`;
            }
            return item.start;
          })
          .join('')
      : '';
  };

  const listfix = (indent = 0, list) => {
    if (list === 'ordered') {
      const number = indentLevel[indent] ? indentLevel[indent] + 1 : 1;
      indentLevel[indent] = number;

      for (let i = indent + 1; i < indentLevel.length; i++) {
        indentLevel[i] = 0;
      }

      return `${'\t'.repeat(indent)}${number}. `;
    } else {
      return `${'\t'.repeat(indent)}${config.option.note.syntax.list} `;
    }
  };

  return (preLine, line, preItem, item, tagStack) => {
    const insert = item?.insert || '';
    const attributes = item?.attributes || {};

    const same = cross(preItem?.attributes, attributes);
    const close = diff(preItem?.attributes, same);
    const open = diff(attributes, same);

    const closedTags = [];
    line += suffix(tagStack, closedTags, open, close);
    line += prefix(tagStack, closedTags, same, open);

    if (attributes?.list) {
      line = listfix(attributes.indent, attributes.list) + line;
    }
    if (preLine && !preLine.find((o) => o.attributes?.list === 'ordered')) {
      indentLevel = [];
    }

    if (isExtended && Object.keys(attributes).length > 0) {
      return `${line}${insert}`;
    } else {
      return `${line}${insert.replace(reg, '\\$&')}`;
    }
  };
};

export const tagHandler = (bvid, { cidCount, desc, index, seconds, title }) => {
  return cidCount === 1
    ? `[🏁 ${dateUtil.formatSeconds[1](seconds)}${
        desc ? ' ' + desc : ''
      }](https://www.bilibili.com/video/${bvid}?t=${seconds})`
    : `[🏁 ${title} P${index} - ${dateUtil.formatSeconds[1](seconds)}${
        desc ? ' ' + desc : ''
      }](https://www.bilibili.com/video/${bvid}?p=${index}#t=${seconds})`;
};

export const imageHandler = (folder) => {
  let images = [];

  return (action) => {
    if (action === 'list') {
      return images;
    } else {
      return ({ id, url }) => {
        const fileName = `${id}.jpg`;
        images.push({ fileName, url });
        return config.option.note.mode === 'obsidian'
          ? `![[${folder}/${fileName}]]`
          : `![](${folder}/${fileName})`;
      };
    }
  };
};
