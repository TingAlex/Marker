const electron = require("electron");

const oper = require("./utils/oper");
const Static = require("./StaticInfo");
const contentProcess = require("./utils/contentProcess");
const upload = require("./utils/upload");

const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} = require("electron-devtools-installer");

// app 负责整个项目的执行流程，BrowserWindow 是用来打开一个新窗口的
// 新增 ipcMain 是后端向前端发送信息用的
const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

// 监听 到 ready 信号后执行函数内部代码
app.on("ready", async () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      webSecurity: false
    }
  });
  mainWindow.loadURL("http://localhost:8080");
  // mainWindow.loadURL(`file://${__dirname}/frontEnd/public/index.html`);

  installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log("An error occurred: ", err));

  installExtension(REDUX_DEVTOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log("An error occurred: ", err));

  oper.initFilesFolder();
  // await upload.clearCookie();
});

ipcMain.on(Static.GET_ARTICLE_LIST, async event => {
  let list = await oper.getArticleList();
  mainWindow.webContents.send(Static.SEND_ARTICLE_LIST, list);
});

ipcMain.on(Static.GET_ARTICLE_CONTENT, async (event, id) => {
  let content = await oper.loadArticle(id);
  mainWindow.webContents.send(Static.SEND_ARTICLE_CONTENT, content);
});

ipcMain.on(Static.MODIFY_ARTICLE_TITLE, async (event, { id, newTitle }) => {
  let newObj = await oper.renameArticle(id, newTitle);
  mainWindow.webContents.send(Static.MODIFIED_ARTICLE_TITLE, newObj.title);
});

// 以往的 save_article 不能够处理文章中的图片链接
// ipcMain.on(Static.SAVE_ARTICLE, async (event, { id, content }) => {
//   let result = await oper.saveArticle(id, content);
//   mainWindow.webContents.send(Static.SAVED_ARTICLE, result);
// });

// 可以处理不包括网络图片的其他本地链接
ipcMain.on(Static.SAVE_ARTICLE_EXP_WEBLINK, async (event, { id, content }) => {
  let newContent = await contentProcess.saveAndProcessArticleExpWebLink(
    id,
    content
  );
  mainWindow.webContents.send(Static.SAVED_ARTICLE_EXP_WEBLINK, newContent);
});

// 专门处理网络图片的链接
ipcMain.on(Static.SAVE_ARTICLE_ONLY_WEBLINK, async (event, { id, content }) => {
  let newContent = await contentProcess.saveAndProcessArticleOnlyWebLink(
    id,
    content
  );
  mainWindow.webContents.send(Static.SAVED_ARTICLE_ONLY_WEBLINK, newContent);
});

ipcMain.on(Static.CREATE_ARTICLE, async event => {
  let obj = await oper.createArticle(Static.DefaultTitle);
  mainWindow.webContents.send(Static.CREATED_ARTICLE, obj);
});

ipcMain.on(Static.DELETE_ARTICLE, async (event, id) => {
  let obj = await oper.deleteArticle(id);
  mainWindow.webContents.send(Static.DELETED_ARTICLE, obj);
});

ipcMain.on(
  Static.SAVE_CLIPBOARD_PIC,
  async (event, { base64, currentArticleId }) => {
    let absolutePath = await oper.savePastePic(base64, currentArticleId);
    mainWindow.webContents.send(Static.SAVED_CLIPBOARD_PIC, absolutePath);
  }
);

ipcMain.on(Static.PUBLIC_ARTICLE, async (event, { articleId, userId }) => {
  let articleInfo = await oper.getAnArticleInfo(articleId);
  // 测试能否把文章信息发送到服务器
  let needPicsArr = await upload.sendArticleInfo(articleInfo);
  // if (needPicsArr.length !== 0) {
  console.log("************needPicsArr***********");
  console.log(needPicsArr);
  let result = await upload.transferPicsOfArticle(articleId, needPicsArr);
  // }
  // console.log("************article web links arr****************");
  // console.log(result);
  // 这里再专门请求下文章内图片们的网链地址？其实我已经知道网链的拼接了。算了
  // 直接靠本地的信息去生成吧，不用再请求了。来读取本地这个文章的内容：
  let articleContent = await oper.loadArticle(articleId);
  // 分割与替换操作开始！
  let translatedContent = contentProcess.translateLocalToWebLink(
    articleContent,
    articleId,
    userId
  );
  mainWindow.webContents.send(Static.NEED_HELP_RENDER_HTML, translatedContent);
});
ipcMain.on(
  Static.AFTER_RENDER_HTML,
  async (event, { articleId, renderedContent }) => {
    console.log("++++++++++++++++markedContent!++++++++++++++");
    // console.log(renderedContent);
    // 得到渲染的文本后，制作成 html 文件。文件名为 index.html。将文件发送到服务器存起来。
    let articleWebLink = await upload.sendRenderedContent(
      articleId,
      renderedContent
    );
    console.log("#########webLink#############");
    console.log(articleWebLink);
    let articleInfo = await oper.setPublicArticle(articleId, articleWebLink);
    console.log("#########articleInfo#############");
    console.log(articleInfo);
    mainWindow.webContents.send(Static.PUBLICED_ARTICLE, articleInfo);
  }
);
