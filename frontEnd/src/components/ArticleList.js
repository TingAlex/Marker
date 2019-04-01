import React from "react";

import { connect } from "react-redux";
import * as articleAction from "../actions/article";

class Article extends React.Component {
  getArticleList = () => {
    this.props.getArticleList();
  };
  render() {
    return (
      <div>
        <button onClick={this.getArticleList}>getArticleList</button>
        {this.props.article.articleList.map(article => {
          return <div key={article.id}>{article.id}</div>;
        })}
      </div>
    );
  }
}

const mapStateToProps = ({ article }) => ({
  article: article
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
