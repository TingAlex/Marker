import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { store } from "./store/configureStore";
import ArticleList from "./components/ArticleList";

ReactDOM.render(
  <Provider store={store}>
    <ArticleList />
  </Provider>,
  document.getElementById("app")
);
