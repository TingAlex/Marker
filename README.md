> 接下来尝试在 electron 的窗口中跑起来之前的 Counter app

![项目结构](https://upload-images.jianshu.io/upload_images/10453247-2b0f9cff8a616751.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

1. 项目中的文件来自于之前的 [videoInfoElectron](https://github.com/TingAlex/videoInfoElectron/tree/db19e1e7a1c22d8178c5e682f34172a6f540b0d4) 与 [ReactReduxExpensify](https://github.com/TingAlex/ReactReduxExpensify/tree/442024adfbc15780a709e87f784990af5937c798)，首先将 videoInfoElectron 的 fluent-ffmpeg 依赖移除，然后加入了 ReactReduxExpensify 项目的所有依赖。其次因为前后端文件夹分开，所以需要对一些路径进行更改： `webpack.config.js` 中的 entry，output，devServer 更改如下
```
const path = require('path');
module.exports = {
  // 待转译的文件入口
  entry: './frontEnd/src/playground/reduxCounter.js',
  // 通过 node 提供的 path 函数获得当前目录。最终合并输出一个 bundle.js
  output: {
    path: path.join(__dirname, 'frontEnd/public'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        // 将 js 与 jsx 文件都进行转译
        test: /\.js$/,
        // 转译非 node_modules 文件夹下的其他所有js文件
        exclude: /node_modules/,
      },
    ],
  },
  // 别忘记配置 server！默认端口为 8080
  devServer: {
    contentBase: path.join(__dirname, 'frontEnd/public'),
    // 将无法识别的地址都返回给 client 端的 index.html
    historyApiFallback: true,
  },
  // 浏览器调试发现错误后可以追溯到转译前源代码的报错位置
  devtool: 'cheap-module-eval-source-map',
};
```
2. electron 的 `index.js` 也需要移除 fluent-ffmpeg 相关部分，并把 electron 入口文件 `index.js` 中的 loadURL 函数中的参数替换成 webpack-dev-server 的对外端口。
```
const electron = require('electron');

// app 负责整个项目的执行流程，BrowserWindow 是用来打开一个新窗口的
// 新增 ipcMain 是后端向前端发送信息用的
const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

// 监听 到 ready 信号后执行函数内部代码
app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL('http://localhost:8080');
  // mainWindow.loadURL(`file://${__dirname}/frontEnd/public/index.html`);
});
```
3. 我对 `package.json` 的 `script` 参数也做了些许调整，就是打字方便一些。
```
  "scripts": {
    "elec": "electron .",
    "server": "webpack-dev-server",
    "build": "webpack"
  },
``` 
4. 打开两个命令行窗口分别运行 `npm run server` 与 `npm run elec`，ok~

![electron+react+redux测试成功](https://upload-images.jianshu.io/upload_images/10453247-ced8e35db992b7db.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

5. 把 Counter 的代码粘贴到 `reduxCounter.js` 中，测试 redux，成功
5. 接下来为 electron app 加入 redux 调试功能，安装 [electron-devtools-installer](https://www.npmjs.com/package/electron-devtools-installer)：
```
C:\Users\Ting\Downloads\test\emptyElectron>cnpm install electron-devtools-installer --save-dev
```
6. 根据 electron-devtools-installer 的文档，在 electron 的 `index.js` 中添加：
```
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} = require('electron-devtools-installer');
``` 
并一定要在 app.on() 中的回调函数中加入下面代码：
```
  installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log('An error occurred: ', err));

  installExtension(REDUX_DEVTOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log('An error occurred: ', err));
```
7. 还需最后一步配置 redux。根据 [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension) 的文档，我们需要对 reducer 进行包裹。打开 `frontEnd/src/playground/reduxCounter.js` 
```
import { combineReducers, createStore } from 'redux';

// 将多个 reducer 添加至一个 root reducer 中
const rootReducer = combineReducers({
  counter: counterReducer,
})

// 没有使用 redux-thunk 等中间件时，这样写就能配置好 redux 调试工具
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
```
8. 运行项目，打开调试窗口，成功！

![electron 安装 redux react 调试工具](https://upload-images.jianshu.io/upload_images/10453247-e905ab4a4109d444.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

9. 上 [redux-thunk](https://github.com/reduxjs/redux-thunk)！
```
C:\Users\Ting\Downloads\test\electronRedux>cnpm install redux-thunk --save
```

10. 因为中间件的存在，我们需要去修改 redux 调试工具的部分代码。同样根据 [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension) 的文档，我们需要新的 reducer 包裹方式。打开 `frontEnd/src/playground/reduxCounter.js` 
```
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

// 使用 redux-thunk 等中间件时，需要如此配置 redux 调试工具
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  {},
  composeEnhancers(applyMiddleware(thunk))
);
```
11. 对 action 进行修改，增加异步操作。
```
const add = () => {
  return dispatch => {
    setTimeout(() => {
      dispatch({ type: 'ADD' });
    }, 2000);
  };
};
const min = () => {
  return dispatch => {
    setTimeout(() => {
      dispatch({ type: 'MIN' });
    }, 2000);
  };
};
const reset = () => {
  return dispatch => {
    setTimeout(() => {
      dispatch({ type: 'RESET' });
    }, 2000);
  };
};
```
12. 测试成功！