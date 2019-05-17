const path = require("path");
const ArticleFolder = path.join(__dirname, "/DataSystem/Articles");
const ImageFolder = path.join(__dirname, "/DataSystem/Images");

module.exports = {
  // path 文件上传路径
  UPLOAD_TARGET_LINK: { host: "localhost", port: "5000", path: "/upload/" },
  // path 文章验证与请求图片上传路径
  ANALYSE_PICS_NEEDED: "http://localhost:5000/article_analyse",
  PIC_WEB_LINK: "http://localhost:5000/upload/",
  UPLOAD_CONTENT_LINK: "http://localhost:5000/article_content/",
  // path 本地文件保存路径
  ARTICLE_FOLDER: ArticleFolder,
  IMAGE_FOLDER: ImageFolder,
  // path 文章在服务器用户的对应文章文件夹下的命名
  WEB_ARTICLE_NAME: "index.html",
  // 国际化
  DEFAULT_TITLE: "Default Title",
  // ipc 前端 请求本地文章列表
  GET_ARTICLE_LIST: "article:getList",
  // ipc 后端 发送本地文章列表
  SEND_ARTICLE_LIST: "article:sendList",
  // ipc 前端 请求指定文章内容
  GET_ARTICLE_CONTENT: "article:getContent",
  // ipc 后端 发送指定文章内容
  SEND_ARTICLE_CONTENT: "article:sendContent",
  // ipc 前端 请求保存文章（不对网链进行处理）
  SAVE_ARTICLE_EXP_WEBLINK: "article:saveExpWeblink",
  // ipc 后端 发送文章保存结果（不对网链进行处理）
  SAVED_ARTICLE_EXP_WEBLINK: "article:savedExpWeblink",
  // ipc 前端 请求保存文章（只对网链进行处理）
  SAVE_ARTICLE_ONLY_WEBLINK: "article:saveOnlyWeblink",
  // ipc 后端 发送文章保存结果（只对网链进行处理）
  SAVED_ARTICLE_ONLY_WEBLINK: "article:savedOnlyWeblink",
  // ipc 前端 请求更改文章标题
  MODIFY_ARTICLE_TITLE: "article:modifyTitle",
  // ipc 后端 发送文章标题更改后的结果
  MODIFIED_ARTICLE_TITLE: "article:modifiedTitle",
  // ipc 前端 请求创建新文章
  CREATE_ARTICLE: "article:createNew",
  // ipc 后端 发送新创建文章的信息
  CREATED_ARTICLE: "article:createdNew",
  // ipc 前端 请求删除指定文章
  DELETE_ARTICLE: "article:deleteCurrent",
  // ipc 后端 发送删除文章后的结果
  DELETED_ARTICLE: "article:deletedCurrent",
  // ipc 前端 请求发布文章
  PUBLIC_ARTICLE: "article:goPublic",
  // ipc 后端 将文章所需图片上传，并以网链修改原文章后，请求前端帮助渲染出 HTML 内容
  NEED_HELP_RENDER_HTML: "article:helpRenderHtml",
  // ipc 前端 发送渲染后的 HTML 内容
  AFTER_RENDER_HTML: "article:afterRenderHtml",
  // ipc 后端 发送发布后的文章网链
  PUBLICED_ARTICLE: "article:goPubliced",
  // ipc 前端 请求转存剪切板粘贴过来的图片
  SAVE_CLIPBOARD_PIC: "pic:save",
  // ipc 后端 发送转存图片成功后修改文章内图片链接地址后的文章内容
  SAVED_CLIPBOARD_PIC: "pic:saved",
  // action 将本地文章列表添加到 store
  ARTICLE_LIST: "ARTICLE_LIST",
  // action 将目标文章内容添加到 store
  ARTICLE_CONTENT: "ARTICLE_CONTENT",
  // action 更新 store 中的渲染内容（未改动 currentContent，无需 editable div 重新渲染）
  MODIFY_RENDER_CONTENT: "MODIFY_RENDER_CONTENT",
  // action 更新 store 中的原文内容与渲染内容（改动了 currentContent，导致 editable div 重新渲染）
  MODIFY_CURRENT_CONTENT: "MODIFY_CURRENT_CONTENT",
  // action 更新 store 中的文章标题
  MODIFY_TITLE: "MODIFY_TITLE",
  // action 更改 store 中的折叠栏状态
  COLLAPSE_SIDER: "COLLAPSE_SIDER",
  // action 更改 store 中文章标题的可编辑状态
  TITTLE_TOGGLE: "TITTLE_TOGGLE",
  // action 向 store 中添加新文章信息
  ADD_ARTICLE: "ADD_ARTICLE",
  // action 从 store 中移除执行文章信息
  REMOVE_ARTICLE: "REMOVE_ARTICLE",
  // action 更新 store 中的用户信息
  FETCH_USER: "FETCH_USER",
  // action 更改 store 中应高亮显示的导航栏条目信息
  SET_HIGHLIGHT: "SET_HIGHLIGHT",
  // action 更新 store 中指定文章的信息
  UPDATE_AN_ARTICLE_INFO: "UPDATE_AN_ARTICLE_INFO"
};

// LOGIN_ERROR: "LOGIN_ERROR",