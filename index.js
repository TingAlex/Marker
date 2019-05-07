const electron = require("electron");

const oper = require("./utils/oper");
const Static = require("./StaticInfo");
const contentProcess = require("./utils/contentProcess");

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
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
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

// 新的 save_article 可以处理图片链接
ipcMain.on(Static.SAVE_ARTICLE, async (event, { id, content }) => {
  let newContent = await contentProcess.saveAndProcessArticle(id, content);
  mainWindow.webContents.send(Static.SAVED_ARTICLE, newContent);
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
