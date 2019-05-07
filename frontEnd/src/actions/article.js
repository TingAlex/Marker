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
      type: Static.MODIFY_RENDER_CONTENT,
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
      dispatch({
        type: Static.MODIFY_CURRENT_CONTENT,
        content: result,
        renderContent: marked(result)
      });
      notification.open({
        message: "Save Successfully!",
        // description: result,
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

// 从指定位置起寻找特定字符串，然后替换
String.prototype.replaceAt = function(searchIndex, removedString, replacement) {
  let resultIndex = this.indexOf(removedString, searchIndex);
  let cutoffNumber = removedString.length;
  return (
    this.substr(0, resultIndex) +
    replacement +
    this.substr(resultIndex + cutoffNumber)
  );
};

export /**
 * 将前端得到的图片文件保存到文章对应的文件夹中，并用图片的绝对地址替换![](pending)中的信息。
 *
 * @param {*} file 图片 的 file 类型对象
 * @param {*} currentArticleId 当前文章 id
 * @param {*} content 含有(pending)的文章内容
 * @param {*} insertIndex 精确指出从何处起搜寻(pending)，以防止和用户自己写的内容冲突
 * @returns
 */
const picProcess = (file, currentArticleId, content, insertIndex) => {
  console.log("copied: " + file.name);
  return dispatch => {
    let pending = "(pending...)";
    var reader = new FileReader();
    reader.addEventListener(
      "load",
      function() {
        let base64 = event.target.result;
        console.log(base64);
        ipcRenderer.send(Static.SAVE_CLIPBOARD_PIC, {
          base64,
          currentArticleId
        });
        ipcRenderer.once(Static.SAVED_CLIPBOARD_PIC, (event, absolutePath) => {
          // 把 content 中从 insertIndex 起找到 (pending...),把这里面的用 absolutePath 替换一下
          let finalContent = content.replaceAt(
            insertIndex,
            pending,
            // node path 生成的路径不能拿到前端直接使用，还是需要将分隔符转一下
            "(" + absolutePath.replace(/\\/g, "/") + ")"
          );
          dispatch({
            type: Static.MODIFY_CURRENT_CONTENT,
            content: finalContent,
            renderContent: marked(finalContent)
          });
        });
      },
      false
    );
    reader.readAsDataURL(file);
  };
};
