import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import thunk from 'redux-thunk';

console.log('marker is ready for your command');

// 将 reducer 改名为了 counterReducer，因为以后会有更多 reducer 加入
const counterReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case 'ADD':
      return {
        count: state.count + 1,
      };
    case 'MIN':
      return {
        count: state.count - 1,
      };
    case 'RESET':
      return {
        count: 0,
      };
    default:
      return state;
  }
};
const add = () => {
  return dispatch => {
    setTimeout(() => {
      dispatch({ type: 'ADD' });
    }, 2000);
  };
};
const min = () => ({ type: 'MIN' });
const reset = () => ({ type: 'RESET' });

// 将多个 reducer 添加至一个 root reducer 中
const rootReducer = combineReducers({
  counter: counterReducer,
});

// 使用 redux-thunk 等中间件时，需要如此配置 redux 调试工具
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  {},
  composeEnhancers(applyMiddleware(thunk))
);

class Counter extends React.Component {
  addOne = () => {
    this.props.add();
  };
  minOne = () => {
    this.props.min();
  };
  resetCount = () => {
    this.props.reset();
  };
  render() {
    return (
      <div>
        <h1>{this.props.count}</h1>
        <button onClick={this.addOne}>+</button>
        <button onClick={this.minOne}>-</button>
        <button onClick={this.resetCount}>reset</button>
      </div>
    );
  }
}

const mapStateToProps = ({ counter }) => ({ count: counter.count });
const mapDispatchToProps = dispatch => ({
  add: () => {
    dispatch(add());
  },
  min: () => {
    dispatch(min());
  },
  reset: () => {
    dispatch(reset());
  },
});

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
