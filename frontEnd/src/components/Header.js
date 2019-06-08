import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as action from "../actions/header";
import { Menu, Affix } from "antd";

class Header extends React.Component {
  handleClick = e => {
    this.props.setHighlight(e.key);
  };
  renderContent() {
    switch (this.props.auth) {
      case null:
        return (
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.props.header.highlight]}
            mode="horizontal"
          >
            <Menu.Item key="dashboard">
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="layout">
              <Link to="/layout">Layout</Link>
            </Menu.Item>
          </Menu>
        );
      case false:
        return (
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.props.header.highlight]}
            mode="horizontal"
          >
            <Menu.Item key="dashboard">
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="layout">
              <Link to="/layout">Layout</Link>
            </Menu.Item>
            <Menu.Item key="signup" style={{ float: `right` }}>
              <Link to="/signup">Sign up</Link>
            </Menu.Item>
            <Menu.Item key="login" style={{ float: `right` }}>
              <Link to="/login">Login</Link>
            </Menu.Item>
          </Menu>
        );
      default:
        return (
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.props.header.highlight]}
            mode="horizontal"
          >
            <Menu.Item key="dashboard">
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="layout">
              <Link to="/layout">Layout</Link>
            </Menu.Item>
            <Menu.Item key="logout" style={{ float: `right` }}>
              <a href="/api/logout">Logout</a>
            </Menu.Item>
            <Menu.Item key="space" style={{ float: `right` }}>
              <Link to="#">
                UsedSpace:{this.props.auth.spaceUsed}/
                {this.props.auth.spaceLimit}
              </Link>
            </Menu.Item>
            <Menu.Item key="username" style={{ float: `right` }}>
              <Link to="#">{this.props.auth.userName}</Link>
            </Menu.Item>
          </Menu>
        );
    }
  }
  render() {
    return this.renderContent();
  }
}

const mapStateToProps = ({ auth, header }) => {
  return { auth, header };
};
const mapDispatchToProps = dispatch => ({
  setHighlight: key => {
    dispatch(action.setHeaderHighlight(key));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
