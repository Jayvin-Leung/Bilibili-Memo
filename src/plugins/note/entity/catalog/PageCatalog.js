import CatalogItem from './CatalogItem';

/**
 * 选集目录清单处理类
 */
class PageCaltalog {
  /**
   * 创建一个选集目录清单处理对象
   * @param {string}                         bvid                    视频bvid
   * @param {{page: number, part: string}[]} pages                   分P数组
   * @param {number}                         pages.item.page         分P数
   * @param {string}                         pages.item.part         分P标题
   * @param {{
   *          titleHandler: Function,
   *          outlinkHandler: Function,
   *        }}                               [option]                可选配置
   * @param {Function}                       [option.titleHandler]   分P标题处理器
   * @param {Function}                       [option.outlinkHandler] 出链处理器
   */
  constructor(bvid, pages, option = { titleHandler, outlinkHandler }) {
    this.bvid = bvid;
    this.pages = pages;
    this.titleHandler = option?.titleHandler;
    this.outlinkHandler = option?.outlinkHandler;
  }

  /**
   * 处理选集目录清单数据并输出结果
   * @returns {CatalogItem} 处理结果
   */
  data() {
    if (!this.bvid) throw new Error('bvid is not found.');
    if (!this.pages || !this.pages.length || this.pages.length === 0) return [];
    return this.pages.map((o) => {
      const title = this.titleHandler ? this.titleHandler(o.page, o.part) : o.part;
      const outlink = this.outlinkHandler ? this.outlinkHandler(title) : title;
      const url = `https://www.bilibili.com/video/${this.bvid}?p=${o.page}`;
      return new CatalogItem(o.page, title, url, outlink);
    });
  }
}

export default PageCaltalog;
