import TemplateFactory from './TemplateFactory';

const _template = {
  callout_tasklist: (catalogs, type) => {
    return renderCallout(type, '- [ ]', catalogs);
  },
  callout_orderedlist: (catalogs, type) => {
    return renderCalloutOrderedlist(type, catalogs);
  },
  callout_bulletedlist: (catalogs, type) => {
    return renderCallout(type, '-', catalogs);
  },
  callout: (catalogs, type) => {
    return renderCallout(type, '', catalogs);
  },
  quotes_tasklist: (catalogs) => {
    return renderQuotes('- [ ]', catalogs);
  },
  quotes_orderedlist: (catalogs) => {
    return renderQuotesOrderedlist(catalogs);
  },
  quotes_bulletedlist: (catalogs) => {
    return renderQuotes('-', catalogs);
  },
  quotes: (catalogs) => {
    return renderQuotes('', catalogs);
  },
  horizontalrule_tasklist: (catalogs) => {
    return renderHorizontalrule('- [ ]', catalogs);
  },
  horizontalrule_orderedlist: (catalogs) => {
    return renderHorizontalruleOrderedlist(catalogs);
  },
  horizontalrule_bulletedlist: (catalogs) => {
    return renderHorizontalrule('-', catalogs);
  },
  horizontalrule: (catalogs) => {
    return renderHorizontalrule('', catalogs);
  },
};

const renderCallout = (type, prefix, catalogs) => {
  return `> [!info]+ 视频${type}\n${catalogs
    .map((item) => `> ${prefix}${prefix && ' '}${item.outlink}`)
    .join('  \n')
    .concat('  \n')}\n`;
};

const renderCalloutOrderedlist = (type, catalogs) => {
  return `> [!info]+ 视频${type}\n${catalogs
    .map((item) => `> ${item.index}. ${item.outlink}`)
    .join('  \n')
    .concat('  \n')}\n`;
};

const renderQuotes = (prefix, catalogs) => {
  return `${catalogs
    .map((item) => `> ${prefix}${prefix && ' '}${item.outlink}`)
    .join('  \n')
    .concat('  \n')}\n`;
};

const renderQuotesOrderedlist = (catalogs) => {
  return `${catalogs
    .map((item) => `> ${item.index}. ${item.outlink}`)
    .join('  \n')
    .concat('  \n')}\n`;
};

const renderHorizontalrule = (prefix, catalogs) => {
  return `---\n${catalogs
    .map((item) => `${prefix}${prefix && ' '}${item.outlink}`)
    .join('  \n')
    .concat('  \n')}---\n\n`;
};

const renderHorizontalruleOrderedlist = (catalogs) => {
  return `---\n${catalogs
    .map((item) => `${item.index}. ${item.outlink}`)
    .join('  \n')
    .concat('  \n')}---\n\n`;
};

/**
 * 渲染目录清单模块
 * @param {{
 *          index: number,
 *          title: string,
 *          outlink: string,
 *          url: string,
 *        }[]}               catalogs                     目录清单数组
 * @param {number}           catalogs.catalogItem.index   选集分P数/合集某集数
 * @param {string}           catalogs.catalogItem.title   选集分P标题/合集某集标题
 * @param {string}           catalogs.catalogItem.url     选集分P地址/合集某集地址
 * @param {string}           catalogs.catalogItem.outlink 选集分P出链/合集某集出链
 * @param {string}           type                         视频类型str：选集，合集
 * @param {string}           style                        目录清单风格
 * @returns {string}                                      渲染结果：目录清单
 */
const render = (catalogs, type, style) => {
  return _template[style](catalogs, type);
};

/**
 * 目录清单模块模板工厂类
 */
class CatalogTemplateFactory extends TemplateFactory {
  /**
   * 创建一个目录清单模块模板工厂
   * @param {string}          videoType      视频类型：single-单视频，multip-选集，season-合集
   * @param {{style: string}} [option]       可选配置
   * @param {string}          [option.style] 目录清单风格：同_template的key
   */
  constructor(videoType, option = { style }) {
    super(videoType);
    this.style = option?.style;
  }

  /**
   * 获取对应风格的目录清单模块模板
   * @returns {{render: Function}} 目录清单模块模板对象
   */
  getTemplate() {
    const template = super.getTemplate();

    if (this.videoType === 'single') {
      template.render = () => '';
    } else if (this.videoType === 'multip') {
      template.render = ({ catalogs }) => {
        return render(catalogs, '选集', this.style);
      };
    } else if (this.videoType === 'season') {
      template.render = ({ catalogs }) => {
        return render(catalogs, '合集', this.style);
      };
    }

    return template;
  }
}

export default CatalogTemplateFactory;
