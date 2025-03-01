import TemplateFactory from './TemplateFactory';

const _template = {
  title: (title, url) => {
    return `## ${title}\n> 视频地址：[${url}](${url})\n\n`;
  },
  content: (content) => {
    return `${content}\n\n`;
  },
};

/**
 * 渲染单视频的笔记内容模块
 * @param {{
 *          notes: {
 *            p: number,
 *            content: string,
 *          }[]
 *        }}                   data                    渲染对象
 * @param {Array}              data.notes              笔记内容数组
 * @param {number}             data.notes.item.p       分P数W
 * @param {string}             data.notes.item.content 该分P下的笔记内容
 * @returns {string}                                   渲染结果：笔记内容
 */
const renderSingle = ({ notes }) => {
  const note = notes?.find((item) => item.p === 1);
  return note?.content ? _template.content(note.content) : '';
};

/**
 * 渲染选集视频的笔记内容模块
 * @param {{
 *          catalogs: {
 *            index: number,
 *            title: string,
 *            outlink: string,
 *            url: string,
 *          }[],
 *          notes: {
 *            p: number,
 *            content: string,
 *          }[]
 *        }}                   data                       渲染对象
 * @param {Array}              data.catalogs              目录清单数组
 * @param {number}             data.catalogs.item.index   选集分P数
 * @param {string}             data.catalogs.item.title   选集分P标题
 * @param {string}             data.catalogs.item.url     选集分P地址
 * @param {string}             data.catalogs.item.outlink 选集分P出链
 * @param {Array}              data.notes                 笔记内容数组
 * @param {number}             data.notes.item.p          分P数
 * @param {string}             data.notes.item.content    该分P下的笔记内容
 * @returns {string}                                      渲染结果：分P标题+笔记内容
 */
const renderMultip = ({ catalogs, notes }) => {
  return catalogs
    .map((item) => {
      const note = notes.find((obj) => obj.p === item.index);
      return _template
        .title(item.title, item.url)
        .concat(note && note.content ? _template.content(note.content) : '');
    })
    .join('');
};

/**
 * 笔记内容模块模板工厂类
 */
class NoteTemplateFactory extends TemplateFactory {
  /**
   * 创建一个笔记内容模块模板工厂
   * @param {string} videoType 视频类型：single-单视频，multip-选集，season-合集
   */
  constructor(videoType) {
    super(videoType);
  }

  /**
   * 获取对应笔记标题格式的笔记内容模块模板
   * @returns {{render: Function}} 笔记内容模块模板对象
   */
  getTemplate() {
    const template = super.getTemplate();

    if (this.videoType === 'single') {
      template.render = renderSingle;
    } else if (this.videoType === 'multip') {
      template.render = renderMultip;
    } else if (this.videoType === 'season') {
      template.render = () => '';
    }

    return template;
  }
}

export default NoteTemplateFactory;
