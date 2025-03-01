import { zip, strToU8 } from 'fflate';
import { messageModal } from '@/components/modal';
import biliUtil from '@/utils/biliUtil';
import { view as viewApi } from '@/service/bilibili/api/video';
import { note as noteApi, info as infoApi } from '@/service/bilibili/api/note';
import FileTemplateFactory from './entity/template/FileTemplateFactory';
import CatalogTemplateFactory from './entity/template/CatalogTemplateFactory';
import NoteTemplateFactory from './entity/template/NoteTemplateFactory';
import EpisodeCatalog from './entity/catalog/EpisodeCatalog';
import PageCatalog from './entity/catalog/PageCatalog';
import Note from './entity/note/Note';
import config from './config';
import {
  fileNameHandler,
  pageTitleHandler,
  episodeOutlinkHandler,
  pageOutlinkHandler,
  textHandler,
  tagHandler,
  imageHandler,
} from './handler';

let imageActionHandler;

const getNoteContent = async (bvid) => {
  const noteRes = await noteApi(bvid);
  const noteIds = noteRes?.noteIds;
  if (!noteIds || !noteIds.length || noteIds.length === 0) return '';

  const infoRes = await infoApi(bvid, noteIds[0]);
  return infoRes?.content || '';
};

const getNoteFile = async (data) => {
  const fileName = `${fileNameHandler(data.title)}.md`;

  const bvid = data.bvid;
  const pages = data.pages;
  const videoType = pages.length > 1 ? 'multip' : 'single';
  const arcOrData = data.arc ? data.arc : data;

  const fileTemplate = new FileTemplateFactory(videoType).getTemplate();
  const catalogTemplate = new CatalogTemplateFactory(videoType, {
    style: config.option.catalog.style,
  }).getTemplate();
  const noteTemplate = new NoteTemplateFactory(videoType).getTemplate();

  const info = {
    cover: arcOrData.pic,
    title: arcOrData.title,
    url: `https://www.bilibili.com/video/${bvid}`,
    desc: arcOrData.desc,
  };
  const catalog = new PageCatalog(bvid, pages, {
    titleHandler: pageTitleHandler,
    outlinkHandler: pageOutlinkHandler(fileName),
  });
  const catalogs = catalog.data();
  const catalogText = catalogTemplate.render({ catalogs });
  const note = new Note(bvid, await getNoteContent(bvid), {
    textHandler: textHandler('init'),
    tagHandler,
    imageHandler: imageActionHandler('save'),
  });
  const notes = note.data();
  const noteText = noteTemplate.render({ catalogs, notes });

  const fileContent = fileTemplate.render({ info, catalog: catalogText, note: noteText });
  return { fileName, fileContent };
};

const getNoteFiles = async (bvid) => {
  if (!bvid) return [];

  const files = [];
  const result = await viewApi(bvid);

  if (result.is_season_display && !config.option.isOnlyCurr) {
    const episodes = result.ugc_season?.sections?.[0]?.episodes;
    if (!episodes || !episodes.length || episodes.length === 0) return [];

    const upUid = result.ugc_season.mid;
    const seasonId = result.ugc_season.id;
    if (!upUid || !seasonId) return [];

    for (const item of episodes) {
      files.push(await getNoteFile(item));
    }

    const fileTemplate = new FileTemplateFactory('season').getTemplate();
    const catalogTemplate = new CatalogTemplateFactory('season', {
      style: config.option.catalog.style,
    }).getTemplate();

    const info = {
      cover: result.ugc_season.cover,
      title: result.ugc_season.title,
      url: `https://space.bilibili.com/${upUid}/lists/${seasonId}?type=season`,
      desc: result.ugc_season.intro,
    };
    const catalog = new EpisodeCatalog(episodes, files, {
      outlinkHandler: episodeOutlinkHandler,
    });
    const catalogs = catalog.data();
    const catalogText = catalogTemplate.render({ catalogs });

    const fileName = '合集目录.md';
    const fileContent = fileTemplate.render({ info, catalog: catalogText });
    files.push({ fileName, fileContent });
  } else {
    files.push(await getNoteFile(result));
  }

  return files;
};

const downloadNote = async (bvid) => {
  const files = {};
  const notes = await getNoteFiles(bvid);
  const images = imageActionHandler('list');
  const folderName = `B站笔记${Date.now()}`;
  const attachmentName = '附件';

  notes.forEach((item) => {
    files[`${folderName}/${item.fileName}`] = strToU8(item.fileContent);
  });

  if (images && images.length > 0) {
    for (const item of images) {
      const content = await fetch(item.url, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      }).then((response) => response.arrayBuffer());
      files[`${folderName}/${attachmentName}/${item.fileName}`] = new Uint8Array(content);
    }
  }

  zip(files, (error, zipped) => {
    if (error) throw error;
    const blob = new Blob([zipped], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${folderName}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  });
};

export const init = () => {
  console.log('初始化笔记&清单功能完成');
};

export const reset = () => {
  console.log('重置笔记&清单功能完成');
};

export const click = () => {
  const bvid = biliUtil.getCurrBvid();
  if (!bvid) {
    messageModal({ title: '信息', message: '请进入视频页再使用！' });
    return;
  }
  imageActionHandler = imageHandler('附件');
  messageModal({ title: '信息', message: '处理中……下载完成后请手动关闭弹窗！' });
  downloadNote(bvid);
};
