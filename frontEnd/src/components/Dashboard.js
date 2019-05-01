import React from "react";
import "../styles/dashboard.css";
import { Layout, Icon, Button, Row, Col, Input } from "antd";
import { connect } from "react-redux";

import { collapseSider, toggleTitle } from "../actions/dashboard";
import { changeTitle, saveContent, createArticle } from "../actions/article";
import ArticleList from "./ArticleList";
import Editor from "./Editor";

const { Header, Sider, Content } = Layout;

class Dashboard extends React.Component {
  toggleSider = () => {
    this.props.changeCollapseSider();
  };
  /**
   * 在普通 div 与 input 输入框之间切换
   *
   * @memberof Dashboard
   */
  toggleTitle = () => {
    this.props.changeTitleInput();
  };
  changeTitle = title => {
    this.props.saveTitleChanges(this.props.currentArticle.id, title);
  };
  createArticle = () => {
    this.props.createNewArticle();
  };
  saveContent = () => {
    this.props.saveContentChanges(
      this.props.currentArticle.id,
      this.props.tempContent
    );
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
          <Button block onClick={this.createArticle}>
            +
          </Button>
          <ArticleList />
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }}>
            <Row>
              <Col span={2}>
                <Icon
                  className="trigger"
                  type={
                    this.props.dashboard.collapsed ? "menu-unfold" : "menu-fold"
                  }
                  onClick={this.toggleSider}
                />
              </Col>
              <Col span={16}>
                {this.props.dashboard.titleToggle ? (
                  <div onClick={this.toggleTitle}>
                    {this.props.currentArticle &&
                      this.props.currentArticle.title}
                  </div>
                ) : (
                  <Input
                    defaultValue={this.props.currentArticle.title}
                    autoFocus="autofocus"
                    onBlur={e => {
                      this.changeTitle(e.target.value);
                      this.toggleTitle();
                    }}
                  />
                )}
              </Col>
              <Col span={6}>
                <Button type="primary" onClick={this.saveContent}>
                  Save
                </Button>
                <Button type="danger">Discard</Button>
                {/* <Button>Default</Button> */}
                <Button type="dashed">Output</Button>
              </Col>
            </Row>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              background: "#fff",
              minHeight: 500
            }}
          >
            <Editor />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = ({ dashboard, article }) => ({
  dashboard,
  currentArticle: article.articleList.filter(
    item => item.id === article.currentArticleId
  )[0],
  tempContent: article.tempContent,
  originContent: article.currentContent
});
const mapDispatchToProps = dispatch => ({
  changeCollapseSider: () => {
    dispatch(collapseSider());
  },
  changeTitleInput: () => {
    dispatch(toggleTitle());
  },
  saveTitleChanges: (id, title) => {
    dispatch(changeTitle(id, title));
  },
  saveContentChanges: (id, content) => {
    dispatch(saveContent(id, content));
  },
  createNewArticle: () => {
    dispatch(createArticle());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
