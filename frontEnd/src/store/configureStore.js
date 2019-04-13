import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { articleReducer } from "../reducers/articleReducer";
import { dashboardReducer } from "../reducers/dashboardReducer";

// 将多个 reducer 添加至一个 root reducer 中
const rootReducer = combineReducers({
  article: articleReducer,
  dashboard: dashboardReducer
});

// 使用 redux-thunk 等中间件时，需要如此配置 redux 调试工具
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer,
  {},
  composeEnhancers(applyMiddleware(thunk))
);
