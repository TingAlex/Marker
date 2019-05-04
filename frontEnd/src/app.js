import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { store } from "./store/configureStore";
import AppRouter from "./routers/AppRouter";

ReactDOM.render(
  <Provider store={store}>
    <AppRouter />
  </Provider>,
  document.getElementById("app")
);
