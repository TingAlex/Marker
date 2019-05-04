import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
class Header extends React.Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return [
          <li key="1">
            <Link to="/">Dashboard</Link>
          </li>,
          <li key="2">
            <Link to="/login">Login</Link>
          </li>,
          <li key="3">
            <Link to="/signup">Sign up</Link>
          </li>
        ];
      default:
        return [
          <li key="1">
            <Link to="/">Dashboard</Link>
          </li>,
          <li key="2">
            <Link to="#">
              UsedSpace:{this.props.auth.spaceUsed}/{this.props.auth.spaceLimit}
            </Link>
          </li>,
          <li key="3">{this.props.auth.userName}</li>,
          <li key="4">
            <a href="/api/logout">Logout</a>
          </li>
        ];
    }
  }
  render() {
    return <ul>{this.renderContent()}</ul>;
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};
export default connect(mapStateToProps)(Header);
