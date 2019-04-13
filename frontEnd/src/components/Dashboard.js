import React from "react";
import "../styles/dashboard.css";
import { Layout, Icon } from "antd";
import { connect } from "react-redux";

import { collapseSider } from "../actions/dashboard";
import ArticleList from "./ArticleList";

const { Header, Sider, Content } = Layout;

class Dashboard extends React.Component {
  toggle = () => {
    this.props.changeCollapseSider();
  };

  render() {
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.props.dashboard.collapsed}
        >
          <div className="logo" />
          <ArticleList />
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }}>
            <Icon
              className="trigger"
              type={
                this.props.dashboard.collapsed ? "menu-unfold" : "menu-fold"
              }
              onClick={this.toggle}
            />
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              background: "#fff",
              minHeight: 500
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = ({ dashboard }) => ({ dashboard });
const mapDispatchToProps = dispatch => ({
  changeCollapseSider: () => {
    dispatch(collapseSider());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

// ReactDOM.render(<SiderDemo />, document.getElementById('container'));
