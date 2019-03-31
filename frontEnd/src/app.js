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
