import Static from "../../../StaticInfo";

import marked from "marked";

var rendererMD = new marked.Renderer();

// Set markdown default options
marked.setOptions({
  renderer: rendererMD,
  pedantic: false,
  gfm: true,
  tables: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  }
});

// 为了能够在 react 框架中使用 ipc，这三行是目前需要的 workround
const electron = window.require("electron");
const fs = electron.remote.require("fs");
const ipcRenderer = electron.ipcRenderer;

export const articleList = () => {
  return dispatch => {
    ipcRenderer.send(Static.GET_ARTICLE_LIST);
    ipcRenderer.on(Static.SEND_ARTICLE_LIST, (event, articleList) => {
      dispatch({ type: Static.ARTICLELIST, articleList });
    });
  };
};

export /**
 * 当点击文章标题后，读取到文档内容后顺便把内容渲染一遍显示出来
 *
 * @param {*} id 文章 id
 * @returns
 */
const articleContent = id => {
  return dispatch => {
    ipcRenderer.send(Static.GET_ARTICLE_CONTENT, id);
    ipcRenderer.on(Static.SEND_ARTICLE_CONTENT, (event, content) => {
      dispatch({
        type: Static.ARTICLECONTENT,
        content,
        id,
        renderContent: marked(content)
      });
    });
  };
};

export /**
 * 当对编辑框中的文章内容进行修改时，自动更新渲染效果
 *
 * @param {*} content 文章内容
 * @returns
 */
const renderContent = content => {
  return dispatch => {
    dispatch({
      type: Static.MODIFYRENDERCONTENT,
      renderContent: marked(content)
    });
  };
};
