import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "antd";
import * as articleAction from "../actions/article";

class Editor extends React.Component {
  onContentChange = e => {
    this.props.renderContent(e.target.innerText);
  };
  /**
   * 将图片保存为文件，并暂时插入![filename](pending...)
   *
   * @memberof Editor
   */
  generatePicFile = async e => {
    let items = (event.clipboardData || window.clipboardData).items;
    let file = null;
    if (items && items.length) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
    }
    if (!file) {
      console.log("paste no pic");
      return;
    }
    // 使得粘贴上的内容被替换为 ![${file.name}](pending...)
    const selection = window.getSelection();
    if (!selection.rangeCount) return false;
    selection.deleteFromDocument();
    selection
      .getRangeAt(0)
      .insertNode(document.createTextNode(`![${file.name}](pending...)`));
    // 通过比较 prevContent 与 newContent，计算出 ![filename](pending...) 的 index，然后替换其中的图片地址
    const prevContent = this.props.article.tempContent;
    // 这里一定要进行 await，否则两个 content 会是完全相等的。
    let result = await this.props.renderContent(e.target.innerText);
    const newContent = this.props.article.tempContent;
    let insertIndex = -1;
    for (let i = 0; i < prevContent.length; i++) {
      if (prevContent[i] !== newContent[i] && newContent[i] === "!") {
        insertIndex = i;
        break;
      }
    }
    this.props.processPic(
      file,
      this.props.article.currentArticleId,
      newContent,
      insertIndex
    );
    event.preventDefault();
  };
  render() {
    return (
      <div>
        <Row>
          <Col span={12}>
            <div
              contentEditable="plaintext-only"
              onInput={e => this.onContentChange(e)}
              suppressContentEditableWarning={true}
              onPaste={e => this.generatePicFile(e)}
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
  },
  processPic: (file, currentArticleId, content, insertIndex) => {
    dispatch(
      articleAction.picProcess(file, currentArticleId, content, insertIndex)
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
