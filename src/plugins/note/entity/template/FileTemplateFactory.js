import TemplateFactory from './TemplateFactory';

const _template = {
  tips: () => {
    return `> [!warning] 警告！！！
> - 如果有出链，先查看出链面板下的数据是否识别成功
> - 打开“设置”-“选项”-“文件与链接”-“始终更新内部链接”功能
> - 确认后方可重新修改笔记名称
> - 没有出链的可直接忽略以上步骤
> - 确认笔记无误后可根据情况删除该警告\n\n`;
  },
  info: (type, cover, title, url, desc) => {
    return `# ${type}信息\n\n![](${cover})\n\n**标题：** ${title}[ ](${url})\n\n**简介：** ${desc}\n\n`;
  },
  catalog: (catalog) => {
    return `# 目录清单\n\n${catalog}`;
  },
  note: (note) => {
    return `# 笔记内容\n\n${note}`;
  },
};

/**
 * 渲染单视频的完整笔记文件
 * @param {{
 *          info: {
 *            cover: string,
 *            title: string,
 *            url: string,
 *            desc: string,
 *          },
 *          note: string,
 *        }}                          data            渲染对象
 * @param {{cover, title, url, desc}} data.info       视频信息对象
 * @param {string}                    data.info.cover 视频封面地址
 * @param {string}                    data.info.title 视频标题
 * @param {string}                    data.info.url   视频地址
 * @param {string}                    data.info.desc  视频简介
 * @param {string}                    data.note       完整笔记内容
 * @returns {string}                                  渲染结果：视频信息+笔记内容
 */
const renderSingle = ({ info: { cover, title, url, desc }, note }) => {
  return _template.info('视频', cover, title, url, desc).concat(_template.note(note));
};

/**
 * 渲染选集视频的完整笔记文件
 * @param {{
 *          info: {
 *            cover: string,
 *            title: string,
 *            url: string,
 *            desc: string,
 *          },
 *          catalog: string,
 *          note: string,
 *        }}                          data            渲染对象
 * @param {{cover, title, url, desc}} data.info       视频信息对象
 * @param {string}                    data.info.cover 视频封面地址
 * @param {string}                    data.info.title 视频标题
 * @param {string}                    data.info.url   视频地址
 * @param {string}                    data.info.desc  视频简介
 * @param {string}                    data.catalog    完整目录清单内容
 * @param {string}                    data.note       完整笔记内容
 * @returns {string}                                  渲染结果：提示+视频信息+目录清单+笔记内容
 */
const renderMultip = ({ info: { cover, title, url, desc }, catalog, note }) => {
  return _template
    .tips()
    .concat(
      _template.info('视频', cover, title, url, desc),
      _template.catalog(catalog),
      _template.note(note)
    );
};

/**
 * 渲染合集视频的目录清单文件
 * @param {{
 *          info: {
 *            cover: string,
 *            title: string,
 *            url: string,
 *            desc: string,
 *          },
 *          catalog: string,
 *        }}                          data            渲染对象
 * @param {{cover, title, url, desc}} data.info       合集信息对象
 * @param {string}                    data.info.cover 合集封面地址
 * @param {string}                    data.info.title 合集标题
 * @param {string}                    data.info.url   合集地址
 * @param {string}                    data.info.desc  合集简介
 * @param {string}                    data.catalog    完整目录清单内容
 * @returns {string}                                  渲染结果：提示+合集信息+目录清单
 */
const renderSeasonCatalog = ({ info: { cover, title, url, desc }, catalog }) => {
  return _template
    .tips()
    .concat(_template.info('合集', cover, title, url, desc), _template.catalog(catalog));
};

/**
 * 文件模板工厂类
 */
class FileTemplateFactory extends TemplateFactory {
  /**
   * 创建一个文件模板工厂
   * @param {string} videoType 视频类型：single-单视频，multip-选集，season-合集
   */
  constructor(videoType) {
    super(videoType);
  }

  /**
   * 获取对应视频类型的文件模板
   * @returns {{render: Function}} 文件模板对象
   */
  getTemplate() {
    const template = super.getTemplate();

    if (this.videoType === 'single') {
      template.render = renderSingle;
    } else if (this.videoType === 'multip') {
      template.render = renderMultip;
    } else if (this.videoType === 'season') {
      template.render = renderSeasonCatalog;
    }

    return template;
  }
}

export default FileTemplateFactory;
