import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Menu, Icon } from "antd";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Header extends React.Component {
  state = {
    current: "dashboard"
  };

  handleClick = e => {
    console.log("click ", e);
    this.setState({
      current: e.key
    });
  };

  renderContent() {
    switch (this.props.auth) {
      case null:
        return <div />;
      case false:
        return (
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="dashboard">
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="login">
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="signup">
              <Link to="/signup">Sign up</Link>
            </Menu.Item>
          </Menu>
        );
      default:
        return (
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="dashboard">
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="space">
              <Link to="#">
                UsedSpace:{this.props.auth.spaceUsed}/
                {this.props.auth.spaceLimit}
              </Link>
            </Menu.Item>
            <Menu.Item key="username">
              <Link to="#">{this.props.auth.userName}</Link>
            </Menu.Item>
            <Menu.Item key="logout">
              <a href="/api/logout">Logout</a>
            </Menu.Item>
          </Menu>
        );
    }
  }
  render() {
    return this.renderContent();
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};
export default connect(mapStateToProps)(Header);
