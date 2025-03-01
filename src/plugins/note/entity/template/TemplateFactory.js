/**
 * 模板工厂基类
 */
class TemplateFactory {
  /**
   * 创建一个模板工厂
   * @param {string} videoType 视频类型：single-单视频，multip-选集，season-合集
   */
  constructor(videoType) {
    this.videoType = videoType;
  }

  /**
   * 获取对应视频类型的模板
   * @returns 模板对象
   */
  getTemplate() {
    if (!['single', 'multip', 'season'].includes(this.videoType)) {
      throw new Error('parameter videoType is invalid');
    }

    return {};
  }
}

export default TemplateFactory;
