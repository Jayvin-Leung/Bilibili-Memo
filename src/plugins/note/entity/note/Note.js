import NoteItem from './NoteItem';

/**
 * 笔记内容处理类
 */
class Note {
  /**
   * 创建一个笔记内容处理对象
   * @param {string}                  bvid                  视频bvid
   * @param {string}                  raw                   B站接口返回的笔记原文
   * @param {{
   *          textHandler: Function,
   *          tagHandler: Function,
   *          imageHandler: Function,
   *        }}                        [option]              可选配置
   * @param {Function}                [option.textHandler]  文本处理器
   * @param {Function}                [option.tagHandler]   时间戳处理器
   * @param {Function}                [option.imageHandler] 图片处理器
   */
  constructor(bvid, raw, option = { textHandler, tagHandler, imageHandler }) {
    this.bvid = bvid;
    this.raw = raw;
    this.textHandler = option?.textHandler;
    this.tagHandler = option?.tagHandler;
    this.imageHandler = option?.imageHandler;
  }

  /**
   * 处理笔记内容并输出结果
   * @returns {NoteItem[]} 处理结果
   */
  data() {
    if (!this.bvid) throw new Error('bvid is not found.');
    if (!this.raw) return [];

    const contents = JSON.parse(this.raw);
    if (!contents || !contents.length || contents.length === 0) return [];

    let line = [];
    const lines = [line];
    for (let item of contents) {
      if (typeof item.insert === 'object') {
        if (item.insert.tag && line.length > 0) {
          line = [];
          lines.push(line);
        }
        line.push(item);
        continue;
      }

      if (!/\n/.test(item.insert)) {
        line.push(item);
        continue;
      }

      const temp = item.insert.split(/\n/);
      for (let i = 0; i < temp.length; i++) {
        if (i > 0) {
          line = [];
          lines.push(line);
        }
        if ((i < temp.length - 1 && (temp[i] || item.attributes)) || temp[i]) {
          line.push({ insert: temp[i], attributes: item.attributes });
        }
      }
    }

    let note = new NoteItem(1, '');
    const notes = [note];
    let preLine = null;
    lines.forEach((line) => {
      let lineText = '';
      const tagStack = [];
      let preItem = null;
      line.forEach((item, index) => {
        if (typeof item.insert === 'string') {
          if (this.textHandler) {
            lineText = this.textHandler(preLine, lineText, preItem, item, tagStack);
            if (index === line.length - 1) {
              lineText = this.textHandler(preLine, lineText, item, null, tagStack);
            }
          } else {
            lineText += item.insert;
          }
        }

        if (item.insert.tag) {
          const index = item.insert.tag.index;
          if (index !== note.p) {
            const temp = notes.find((obj) => obj.p === index);
            if (!temp) {
              note = new NoteItem(index, '');
              notes.push(note);
            } else {
              note = temp;
            }
          }
          lineText += this.tagHandler
            ? this.tagHandler(this.bvid, { ...item.insert.tag })
            : '';
        }

        if (item.insert.imageUpload) {
          lineText += this.imageHandler
            ? this.imageHandler({ ...item.insert.imageUpload })
            : '';
        }

        preItem = item;
        preLine = null;
      });

      note.content = note.content.concat(lineText, '\n\n');
      preLine = line;
    });

    return notes;
  }
}

export default Note;
