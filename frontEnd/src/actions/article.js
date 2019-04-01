import Static from '../../../StaticInfo'

// 为了能够在 react 框架中使用 ipc，这三行是目前需要的 workround
const electron = window.require("electron");
const fs = electron.remote.require("fs");
const ipcRenderer = electron.ipcRenderer;

export const articleList = () => {
  return dispatch => {
    ipcRenderer.send(Static.GET_ARTICLE_LIST);
    ipcRenderer.on(Static.SEND_ARTICLE_LIST, (event, articleList) => {
      dispatch({ type: "ARTICLELIST", articleList });
    });
  };
};