import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "antd";
import * as articleAction from "../actions/article";

class Editor extends React.Component {
  onContentChange = e => {
    this.props.renderContent(e.target.innerText);
  };
  render() {
    return (
      <div>
        {/* <Row>
          <Col span={24}>
            <input
              type="text"
              placeholder="输入文章标题..."
              spellCheck="false"
            />
          </Col>
        </Row> */}
        <Row>
          <Col span={12}>
            <div
              contentEditable="plaintext-only"
              onInput={e => this.onContentChange(e)}
              suppressContentEditableWarning={true}
            >
              {this.props.article.currentContent}
            </div>
          </Col>
          <Col span={12}>
            <div
              dangerouslySetInnerHTML={{
                __html: this.props.article.renderContent
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ article }) => ({
  article
});

const mapDispatchToProps = dispatch => ({
  renderContent: content => {
    dispatch(articleAction.renderContent(content));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
