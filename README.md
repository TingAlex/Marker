>本章目标为实现 markdown 编辑器的数据库，提供基本的文章创建、修改、文章名修改、删除与获取文章列表的操作。本章的项目基于上一章的 [markerElec](https://github.com/TingAlex/markerElec/tree/500da9dd071d2d9d2c811a1ab4a40e1ef5adcff7)，（注意通过此下载链接获得对应的历史版本，而不是在 github 下载这个项目的 master 版本）。

![项目结构](https://upload-images.jianshu.io/upload_images/10453247-9b2945dda20ff0cb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 实现步骤
1. 我们使用 [lowdb](https://github.com/typicode/lowdb) 作为数据库，安装 [lodash-id](https://github.com/typicode/lodash-id) 为 lowdb 提供 id，**可选**引入 [fs-extra](https://github.com/jprichardson/node-fs-extra) 替代 fs。**暂时本文章先不需要，但后面文章应该会用到**引入 [chokidar](https://github.com/paulmillr/chokidar) 监视文件夹的改变。**暂时本文章先不需要，但后面文章应该会用到**安装 [momentjs](https://momentjs.com/docs/) 为程序提供更方便的时间输出。这些都被安装到 `dependencies` 下。
```
C:\Users\Ting\Documents\Elec\marker\markerElec>cnpm install fs-extra chokidar lowdb lodash-id moment --save
```
2. 在根目录创建 `utils` 文件夹，程序的底层操作函数都放在这里。目前在其中新建三个 js 文件：oper.js，dbSystem.js，fileSystem.js。oper.js 是对另外两个文件的再上一层封装，这样 electron 的后端需要对文件操作时只要引入这一个文件就可以了。
3. 以下是 dbSystem.js 中的代码：
```
const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const lodashId = require("lodash-id");
const moment = require("moment");

// lowdb 固定写法
const dbJson = path.join(__dirname, "../DataSystem/db.json");
const adapter = new FileSync(dbJson);
const db = low(adapter);

// 因为我需要 uid，所以额外引入了 lodash-id，要这样写
db._.mixin(lodashId);

// Set some defaults (required if your JSON file is empty)
db.defaults({ articles: [], images: [], user: {} }).write();
let ARTICLES = "articles";
let IMAGES = "images";
let USER = "user";

/**
 * 创建空文章信息
 *
 * @param {*} title 文章名
 * @returns 文章 id
 */
const createArticle = title => {
  return db
    .get(ARTICLES)
    .insert({
      title,
      folder: "default",
      webLocation: "",
      lastModefiedTime: new Date()
    })
    .write();
};

/**
 * 重命名文章
 *
 * @param {*} id 文章 id
 * @param {*} title 新文章名
 * @returns 文章数据库信息对象
 */
const renameArticle = (id, title) => {
  return db
    .get(ARTICLES)
    .getById(id)
    .assign({ title })
    .write();
};

/**
 * 获取文章列表
 *
 * @returns 文章列表数组
 */
const getArticleList = () => {
  return db
    .get(ARTICLES)
    .sortBy("lastModefiedTime")
    .value();
};

module.exports = {
  createArticle,
  renameArticle,
  getArticleList
};
```
4. 以下是 fileSystem.js 中的代码：
```
const fs = require("fs-extra");
const path = require("path");
const chokidar = require("chokidar");

const ArticleFolder = path.join(__dirname, "../DataSystem/Articles");
const ImageFolder = path.join(__dirname, "../DataSystem/Images");

/**
 * 初始化文章与图片的本地保存位置
 * @returns {string} 文件夹是否创建成功的信息
 */
var initArticleAndImageFolder = () => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(ArticleFolder)) {
      fs.mkdir(ArticleFolder, { recursive: true }, err => {
        if (err) reject(err);
        resolve("Init Article Folder Successfully!");
      });
    }
    if (!fs.existsSync(ImageFolder)) {
      fs.mkdir(ImageFolder, { recursive: true }, err => {
        if (err) reject(err);
        resolve("Init Image Folder Successfully!");
      });
    }
  });
};

/**
 * 新建空文件
 *
 * @param {string} title
 * @returns {string} 文章是否创建成功的信息
 */
var createArticle = title => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(ArticleFolder, title + ".md");
    if (!fs.existsSync(filePath)) {
      fs.writeFile(filePath, "", err => {
        resolve(err ? err : "file created!");
      });
    } else {
      reject("file aleardy exists!");
    }
  });
};

/**
 * 读取文件
 *
 * @param {*} title 文章标题，其实也就是文章 id
 * @returns 报错信息或是文章内容
 */
var loadArticle = title => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(ArticleFolder, title + ".md");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

/**
 * 覆写文件
 *
 * @param {string} title 文章标题，其实也就是文章 id
 * @param {string} content 新文件内容
 * @returns 写回是否成功的信息
 */
var saveArticle = (title, content) => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(ArticleFolder, title + ".md");
    fs.writeFile(filePath, content, "utf8", err => {
      if (err) {
        reject(err);
      }
      resolve("file save successfully!");
    });
  });
};

/**
 * 监听文件夹内容的改变
 * TODO: 利用监听做什么？想清楚
 * @param {string} dic
 */
var listenArticles = dic => {
  chokidar.watch(dic, { ignored: /(^|[\/\\])\../ }).on("all", (event, path) => {
    console.log(event, path);
  });
};

module.exports = {
  initArticleAndImageFolder,
  createArticle,
  loadArticle,
  saveArticle,
  listenArticles
};
```
5. 以下是 oper.js 中的代码：
```
const dbSys = require("./dbSystem");
const fileSys = require("./fileSystem");
// 通过代码在根目录创建 DataSystem 文件夹，并在其中创建 Articles 与 Images 文件夹，程序的缓存文件都在这里。
// 文章的 id 是核心。用户点击新建文件按钮，然后lowdb为其分配id，保存用户
// 设置的 title。使用id作为文章保存的文件名，避免重复。id被返回到前端对应到
// 新文章的 redux store中。
// 获取文章列表，后端直接将数据库的文章信息都反馈给前端就好不需要访问文件系统。
// 用户点击文章，前端将文章 id 发送到后端，后端直接读取文章，返回给前端，不需要走数据库。
// 用户保存文章，前端将文章 id 与 content 发送到后端，后端直接覆盖之前的文件，不需要走数据库。
// 用户重命名文章，前端将文章 id 与 新名称 发送到后端，后端直接修改数据库中保存的 title即可。

/**
 * 初始化文章与图片的本地保存位置
 * @returns {string} 文件夹是否创建成功的信息
 */
var initFilesFolder = async () => {
  let result = await fileSys.initArticleAndImageFolder();
  return result;
};

/**
 * 新建空文件
 *
 * @param {string} title 文件名称
 * @returns {string} 文件 id
 */
var createArticle = async title => {
  let article = dbSys.createArticle(title);
  let idOfArticle = article.id;
  if (idOfArticle) {
    let result = await fileSys.createArticle(idOfArticle);
    if (result === "file created!") {
      return idOfArticle;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};

/**
 * 读取文件
 * TODO: 增加错误处理
 * @param {string} id 文件 id
 * @returns {string} 文件内容
 */
var loadArticle = async id => {
  let content = await fileSys.loadArticle(id);
  return content;
};

/**
 * 覆写文件
 * TODO: 增加错误处理
 * @param {string} id 文件 id
 * @param {string} content 新文件内容
 * @returns {string} 写回是否成功的信息
 */
var saveArticle = async (id, content) => {
  let result = await fileSys.saveArticle(id, content);
  return result;
};

/**
 * 重命名文章
 *
 * @param {*} id 文章 id
 * @param {*} title 新文章名
 * @returns 文章数据库信息对象
 */
var renameArticle = async (id, title) => {
  let result = await dbSys.renameArticle(id, title);
  return result;
};

/**
 * 获取文章列表
 *
 * @returns 文章列表数组
 */
var getArticleList = async () => {
  let result = await dbSys.getArticleList();
  console.log(result);

  return result;
};

module.exports = {
  initFilesFolder,
  createArticle,
  loadArticle,
  saveArticle,
  renameArticle,
  getArticleList
};
```
6. 对 electron 项目的 index.js 增加如下代码，以测试文章列表获取是否成功：
```
const oper = require("./utils/oper");
const Static = require("./StaticInfo");

ipcMain.on(Static.GET_ARTICLE_LIST, async event => {
  let list = await oper.getArticleList();
  mainWindow.webContents.send(Static.SEND_ARTICLE_LIST, list);
})
```
其中的 Static 来自于是根目录下一个新建的常量文件 `StaticInfo.js`，前后端的 ipc 通信名称就来自于这里。目前其中的信息如下：
```
module.exports = {
  GET_ARTICLE_LIST: "article:getList",
  SEND_ARTICLE_LIST: "article:sendList",
  GET_ARTICLE_CONTENT: "article:getContent",
  SEND_ARTICLE_CONTENT: "article:sendContent",
  SAVE_ARTICLE: "article:save"
};
```
7. 修改 webpack.config.js 中的 entry 字段：
```
  entry: "./frontEnd/src/app.js",
```
8. 在 frontEnd/src/app.js 文件中放置如下代码：
```
import React from "react";
import ReactDOM from "react-dom";
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { connect, Provider } from "react-redux";
import thunk from "redux-thunk";

import Static from "../../StaticInfo";

// 为了能够在 react 框架中使用 ipc，这三行是目前需要的 workround
const electron = window.require("electron");
const fs = electron.remote.require("fs");
const ipcRenderer = electron.ipcRenderer;

console.log("marker is ready for your command");

const articleReducer = (state = { currentArticle: {}, articleList: [] }, action) => {
  switch (action.type) {
    case "ARTICLELIST":
      return { ...state, articleList: action.articleList };
    default:
      return state;
  }
};

const articleList = () => {
  return dispatch => {
    ipcRenderer.send(Static.GET_ARTICLE_LIST);
    ipcRenderer.on(Static.SEND_ARTICLE_LIST, (event, articleList) => {
      dispatch({ type: "ARTICLELIST", articleList });
    });
  };
};

// 将多个 reducer 添加至一个 root reducer 中
const rootReducer = combineReducers({
  article: articleReducer
});

// 使用 redux-thunk 等中间件时，需要如此配置 redux 调试工具
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  {},
  composeEnhancers(applyMiddleware(thunk))
);

class Article extends React.Component {
  getArticleList = () => {
    this.props.getArticleList();
  };
  render() {
    return (
      <div>
        <button onClick={this.getArticleList}>getArticleList</button>
      </div>
    );
  }
}

const mapStateToProps = ({ article }) => ({
  article: article
});
const mapDispatchToProps = dispatch => ({
  getArticleList: () => {
    dispatch(articleList());
  }
});

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Article);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
```
9. 为了能接收到数据，需要自己运行 utils/oper.js 去创建几个 md 文档。可以使用类似这样的代码：
```
var testCreateSaveRename = async () => {
  let newId = await createArticle("test file");
  let result = await saveArticle(newId, "this is me, here I am");
  let info = await renameArticle(newId, "Ting is here");
  return info;
};
```
10. 在命令行分别运行 `npm run server` `npm run elec`，成功！

![前端成功获得文章列表](https://upload-images.jianshu.io/upload_images/10453247-330ec4516cd35db4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)