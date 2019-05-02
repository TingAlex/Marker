import Static from "../../../StaticInfo";

import marked from "marked";

import React from "react";
import { notification, Icon } from "antd";

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
    ipcRenderer.once(Static.SEND_ARTICLE_LIST, (event, articleList) => {
      dispatch({ type: Static.ARTICLELIST, articleList });
    });
  };
};

export /**
 * 当点击文章标题后，读取到文档内容后顺便把内容渲染一遍显示出来，把 temp 文件也初始化下
 *
 * @param {*} id 文章 id
 * @returns
 */
const articleContent = id => {
  return dispatch => {
    ipcRenderer.send(Static.GET_ARTICLE_CONTENT, id);
    ipcRenderer.once(Static.SEND_ARTICLE_CONTENT, (event, content) => {
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
      content,
      renderContent: marked(content)
    });
  };
};

export /**
 * 一方面修改前端 store 中的 title，一方面通知后端修改 db 中的 title
 *
 * @param {*} id
 * @param {*} newTitle
 * @returns
 */
const changeTitle = (id, newTitle) => {
  return dispatch => {
    dispatch({
      type: Static.MODIFY_TITLE,
      title: newTitle
    });
    ipcRenderer.send(Static.MODIFY_ARTICLE_TITLE, { id, newTitle });
    ipcRenderer.once(Static.MODIFIED_ARTICLE_TITLE, (event, title) => {});
  };
};

export const saveContent = (id, content) => {
  return dispatch => {
    ipcRenderer.send(Static.SAVE_ARTICLE, { id, content });
    ipcRenderer.once(Static.SAVED_ARTICLE, (event, result) => {
      notification.open({
        message: "Save Successfully!",
        description: result,
        icon: <Icon type="smile" style={{ color: "#108ee9" }} />
      });
    });
  };
};

export const createArticle = () => {
  return dispatch => {
    ipcRenderer.send(Static.CREATE_ARTICLE);
    ipcRenderer.once(Static.CREATED_ARTICLE, (event, article) => {
      dispatch({
        type: Static.ADD_ARTICLE,
        article
      });
    });
  };
};

export const deleteArticle = id => {
  return dispatch => {
    ipcRenderer.send(Static.DELETE_ARTICLE, id);
    ipcRenderer.once(Static.DELETED_ARTICLE, (event, article) => {
      dispatch({
        type: Static.REMOVE_ARTICLE,
        id
      });
      notification.open({
        message: "Delete Successfully!",
        description: article[0].title,
        icon: <Icon type="smile" style={{ color: "#108ee9" }} />
      });
    });
  };
};
