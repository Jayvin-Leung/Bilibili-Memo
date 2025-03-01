import CatalogItem from './CatalogItem';

/**
 * 合集目录清单处理类
 */
class EpisodeCatalog {
  /**
   * 创建一个合集目录清单处理对象
   * @param {{bvid: string, title: string}[]} episodes                合集数组
   * @param {string}                          episodes.item.bvid      视频bvid
   * @param {string}                          episodes.item.title     视频标题
   * @param {{fileName: string}[]}            files                   笔记文件数组
   * @param {string}                          files.item.fileName     笔记文件名
   * @param {{outlinkHandler: Function}}      [option]                可选配置
   * @param {Function}                        [option.outlinkHandler] 出链处理器
   */
  constructor(episodes, files, option = { outlinkHandler }) {
    this.episodes = episodes;
    this.files = files;
    this.outlinkHandler = option?.outlinkHandler;
  }

  /**
   * 处理合集目录清单数据并输出结果
   * @returns {CatalogItem} 处理结果
   */
  data() {
    if (!this.episodes || !this.episodes.length || this.episodes.length === 0) return [];
    return this.episodes.map((o, index) => {
      const fileName = this.files[index]?.fileName || '';
      const outlink = this.outlinkHandler ? this.outlinkHandler(fileName) : fileName;
      const url = `https://www.bilibili.com/video/${o.bvid}`;
      return new CatalogItem(index + 1, o.title, url, outlink);
    });
  }
}

export default EpisodeCatalog;
