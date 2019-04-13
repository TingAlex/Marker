import React from "react";
import { connect } from "react-redux";
import { Menu, Icon } from "antd";
import * as articleAction from "../actions/article";

class Article extends React.Component {
  componentDidMount() {
    this.getArticleList();
  }
  getArticleList = () => {
    this.props.getArticleList();
  };
  render() {
    return (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        {this.props.article.articleList.map(article => {
          return (
            <Menu.Item key={article.id}>
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
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Article);
