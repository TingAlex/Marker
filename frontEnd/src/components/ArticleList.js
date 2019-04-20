import React from "react";
import { connect } from "react-redux";
import { Menu, Icon } from "antd";
import * as articleAction from "../actions/article";

class Article extends React.Component {
  componentDidMount() {
    this.getArticleList();
    // this.props.renderContent("haha");
  }
  getArticleList = () => {
    this.props.getArticleList();
  };

  getContent = id => {
    this.props.getArticleContent(id);
  };
  render() {
    return (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        {this.props.article.articleList.map(article => {
          return (
            <Menu.Item
              key={article.id}
              onClick={() => {
                this.getContent(article.id);
              }}
            >
              <Icon type="user" />
              <span>{article.title}</span>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }
}

const mapStateToProps = ({ article }) => ({
  article
});
const mapDispatchToProps = dispatch => ({
  getArticleList: () => {
    dispatch(articleAction.articleList());
  },
  getArticleContent: id => {
    dispatch(articleAction.articleContent(id));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Article);
