const path = require("path");
const ArticleFolder = path.join(__dirname, "/DataSystem/Articles");
const ImageFolder = path.join(__dirname, "/DataSystem/Images");

module.exports = {
  // 文件路径
  ARTICLE_FOLDER: ArticleFolder,
  IMAGE_FOLDER: ImageFolder,
  // 国际化相关
  DefaultTitle: "Default Title",
  // ipc 相关
  GET_ARTICLE_LIST: "article:getList",
  SEND_ARTICLE_LIST: "article:sendList",
  GET_ARTICLE_CONTENT: "article:getContent",
  SEND_ARTICLE_CONTENT: "article:sendContent",
  SAVE_ARTICLE: "article:save",
  SAVED_ARTICLE: "article:saved",
  MODIFY_ARTICLE_TITLE: "article:modifyTitle",
  MODIFIED_ARTICLE_TITLE: "article:modifiedTitle",
  CREATE_ARTICLE: "article:createNew",
  CREATED_ARTICLE: "article:createdNew",
  DELETE_ARTICLE: "article:deleteCurrent",
  DELETED_ARTICLE: "article:deletedCurrent",
  // 转存剪切板粘贴过来的图片 ipc
  SAVE_CLIPBOARD_PIC: "pic:save",
  SAVED_CLIPBOARD_PIC: "pic:saved",
  // action 相关
  ARTICLELIST: "ARTICLE_LIST",
  ARTICLECONTENT: "ARTICLE_CONTENT",
  // 这个没有改动 currentContent，所以没有导致 editable div 的重新 render
  MODIFY_RENDER_CONTENT: "MODIFY_RENDER_CONTENT",
  // 这个改动了 currentContent，导致 editable div 的重新 render
  MODIFY_CURRENT_CONTENT: "MODIFY_CURRENT_CONTENT",
  MODIFY_TITLE: "MODIFY_TITLE",
  COLLAPSE_SIDER: "COLLAPSE_SIDER",
  TITTLE_TOGGLE: "TITTLE_TOGGLE",
  SAVESUCCESSED: "SAVE_SUCCESSED",
  ADD_ARTICLE: "ADD_ARTICLE",
  REMOVE_ARTICLE: "REMOVE_ARTICLE",
  // action 登录相关
  FETCH_USER: "FETCH_USER",
  LOGIN_ERROR: "LOGIN_ERROR",
  // action Header 相关
  SET_HIGHLIGHT: "SET_HIGHLIGHT",
  // action Pic 相关
  // PIC_PROCESS: "PIC_PROCESS"
};
