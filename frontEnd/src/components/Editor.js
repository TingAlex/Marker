import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "antd";
import * as articleAction from "../actions/article";
import "../styles/editor.css";

class Editor extends React.Component {
  onContentChange = e => {
    this.props.renderContent(e.target.innerText);
  };

  identifyPicString = item => {
    return new Promise((resolve, reject) => {
      item.getAsString(str => {
        if (str.length > 300 && str.indexOf("data:image") === 0) {
          resolve({ type: "picString", str });
        } else {
          resolve({ type: "string", str });
        }
      });
    });
  };

  dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  /**
   * 将图片保存为文件，并暂时插入![filename](pending...)，再将修改后的图片信息插入回文章
   *
   * @memberof Editor
   */
  generatePicFile = async e => {
    e.preventDefault();
    e.persist();
    let items = (e.clipboardData || window.clipboardData).items;
    let file = null;
    let normatText = "";
    if (items && items.length) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("text/plain") !== -1) {
          let result = await this.identifyPicString(items[i]);
          console.log(result.type);
          if (result.type === "picString") {
            file = this.dataURLtoFile(result.str, "image");
          } else {
            normatText = result.str;
          }
          break;
        }
        if (items[i].type.indexOf("image") !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
    }
    if (!file) {
      console.log("paste normal text: " + normatText);
      const selection = window.getSelection();
      if (!selection.rangeCount) return false;
      selection.deleteFromDocument();
      selection.getRangeAt(0).insertNode(document.createTextNode(normatText));
      let result = await this.props.renderContent(e.target.innerText);
      return;
    }

    // 使得粘贴上的内容被替换为 ![${file.name}](pending...)
    const selection = window.getSelection();
    if (!selection.rangeCount) return false;
    selection.deleteFromDocument();
    selection
      .getRangeAt(0)
      .insertNode(
        document.createTextNode(`\n\n![${file.name}](pending...)\n\n`)
      );
    // 通过 anchorOffset 得到 ![filename](pending...) 的 index，然后替换其中的图片地址
    let lastEditIndex = selection.anchorOffset;
    // 这里渲染下还有 pending 显示时的效果
    await this.props.renderContent(e.target.innerText);
    const newContent = this.props.article.tempContent;
    this.props.processPic(
      file,
      this.props.article.currentArticleId,
      newContent,
      lastEditIndex
    );
  };
  render() {
    return (
      <div>
        <Row>
          <Col span={11}>
            <div
              className="fixHeightEditor"
              contentEditable="plaintext-only"
              onInput={e => this.onContentChange(e)}
              suppressContentEditableWarning={true}
              onPaste={e => this.generatePicFile(e)}
              onDrop={e => this.getPicBase64(e)}
            >
              {this.props.article.currentContent}
            </div>
          </Col>
          <Col span={2} />
          <Col span={11}>
            <div
              id="renderedContent"
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
