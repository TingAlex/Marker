import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions/user";

import Login from "../components/Login";
import SignUp from "../components/SignUp";
import Dashboard from "../components/Dashboard";
import Header from "../components/Header";

class AppRouter extends React.Component {
  componentDidMount() {
    this.props.fetchUser();
    // this.props.fetchPics();
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default connect(
  null,
  actions
)(AppRouter);
