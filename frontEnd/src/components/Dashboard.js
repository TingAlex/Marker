import React from "react";
import "../styles/dashboard.css";
import { Layout, Icon, Button, Row, Col, Input } from "antd";
import { connect } from "react-redux";

import { collapseSider, toggleTitle } from "../actions/dashboard";
import {
  changeTitle,
  saveContent,
  createArticle,
  deleteArticle,
  transWeblinkSaveContent,
  uploadArticleToServer,
  withdrawArticleFromServer
} from "../actions/article";
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
  deleteArticle = () => {
    this.props.deleteCurrentArticle(
      this.props.currentArticle.id,
      this.props.currentArticle.published
    );
  };
  saveContent = () => {
    this.props.saveContentChanges(
      this.props.currentArticle.id,
      this.props.tempContent
    );
  };
  // 将文章中的网络图片下载到本地并替换、保存
  transWebLinkPic = () => {
    this.props.transWebLinkPicAndSaveArticle(
      this.props.currentArticle.id,
      this.props.tempContent
    );
  };
  uploadArticle = () => {
    this.props.uploadArticle(this.props.currentArticle.id, this.props.auth._id);
  };

  withdrawArticle = () => {
    this.props.withdrawArticle(this.props.currentArticle.id);
  };
  renderTools = () => {
    if (!this.props.currentArticle) {
      return <Col span={12} />;
    }
    if (!this.props.currentArticle.published) {
      return (
        <Col span={12}>
          <Button type="primary" onClick={this.saveContent}>
            Save
          </Button>
          &nbsp;&nbsp;
          <Button type="primary" onClick={this.transWebLinkPic}>
            TransWeblink
          </Button>
          &nbsp;&nbsp;
          <Button type="primary" onClick={this.uploadArticle}>
            GoPublic
          </Button>
          &nbsp;&nbsp;
          <Button type="danger" onClick={this.deleteArticle}>
            Delete
          </Button>
        </Col>
      );
    } else {
      return (
        <Col span={12}>
          <Button type="primary" onClick={this.saveContent}>
            Save
          </Button>
          &nbsp;&nbsp;
          <Button type="primary" onClick={this.transWebLinkPic}>
            TransWeblink
          </Button>
          &nbsp;&nbsp;
          <Button type="primary" onClick={this.uploadArticle}>
            RePublic
          </Button>
          &nbsp;&nbsp;
          <Button type="primary" onClick={this.withdrawArticle}>
            GoPrivate
          </Button>
          &nbsp;&nbsp;
          <Button type="danger" onClick={this.deleteArticle}>
            Delete
          </Button>
        </Col>
      );
    }
  };

  render() {
    return (
      <Layout>
        <Sider
          className="fixHeightSider"
          trigger={null}
          collapsible
          collapsed={this.props.dashboard.collapsed}
        >
          <div className="logo" />
          <Button block onClick={this.createArticle}>
            Add
          </Button>
          <ArticleList />
        </Sider>
        {this.props.currentArticle ? (
          <Layout>
            <Header style={{ background: "#fff", padding: `0 24px` }}>
              <Row>
                <Col span={8}>
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
                <Col span={4} />
                {this.renderTools()}
              </Row>
            </Header>
            {this.props.currentArticle &&
            this.props.currentArticle.published ? (
              <Content
                style={{
                  margin: "24px 16px",
                  padding: 24,
                  background: "#fff",
                  minHeight: 50
                }}
              >
                <Row>
                  <Col span={24}>
                    <a>{this.props.currentArticle.publicLink}</a>
                  </Col>
                </Row>
              </Content>
            ) : (
              <div />
            )}

            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                background: "#fff",
                minHeight: 500,
                maxHeight: 500,
                overflow: `auto`
              }}
            >
              <Editor />
            </Content>
          </Layout>
        ) : (
          <div />
        )}
      </Layout>
    );
  }
}

const mapStateToProps = ({ dashboard, article, auth }) => ({
  dashboard,
  auth,
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
  },
  deleteCurrentArticle: (id, published) => {
    dispatch(deleteArticle(id, published));
  },
  transWebLinkPicAndSaveArticle: (id, content) => {
    dispatch(transWeblinkSaveContent(id, content));
  },
  uploadArticle: (articleId, userId) => {
    dispatch(uploadArticleToServer(articleId, userId));
  },
  withdrawArticle: articleId => {
    dispatch(withdrawArticleFromServer(articleId));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
