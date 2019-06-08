import React from "react";
import PhotoLayoutEditor from "react-photo-layout-editor";
import * as util from "./util";
import "../styles/layoutStyle/app.scss";
import "../styles/layout.scss";

class Layout extends React.Component {
  constructor() {
    super();
    this._photoLayoutEditor = null;
  }

  action(id, value) {
    let result = null;
    let keys = [];
    let preference = null;

    switch (id) {
      case "util.makeImage":
        let makeImage = this._photoLayoutEditor.api.util.makeImage(
          "jpg",
          0.9,
          2,
          "base64"
        );
        makeImage.progress(function(total, current, image) {
          console.log("PROGRESS", total, current, image);
        });
        makeImage.done(function(src) {
          console.warn("DONE");
          console.log(src);

          let str = src;
          console.log("get here!!");
          const el = document.createElement("textarea"); // Create a <textarea> element
          el.value = str; // Set its value to the string that you want copied
          el.setAttribute("readonly", ""); // Make it readonly to be tamper-proof
          el.style.position = "absolute";
          el.style.left = "-9999px"; // Move outside the screen to make it invisible
          document.body.appendChild(el); // Append the <textarea> element to the HTML document
          const selected =
            document.getSelection().rangeCount > 0 // Check if there is any content selected previously
              ? document.getSelection().getRangeAt(0) // Store selection if found
              : false; // Mark as false to know no selection existed before
          el.select(); // Select the <textarea> content
          document.execCommand("copy"); // Copy - only works as a result of a user action (e.g. click events)
          document.body.removeChild(el); // Remove the <textarea> element
          if (selected) {
            // If a selection existed before copying
            document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
            document.getSelection().addRange(selected); // Restore the original selection
          }

          let outpout = document.getElementById("makeImageArea");
          outpout.innerHTML = `<img src="${src}" alt="output image"/>`;
        });
        makeImage.fail(function(error) {
          console.error("ERROR", error);
        });
        break;
    }
  }

  render() {
    return (
      <div className="app">
        <PhotoLayoutEditor
          side={{ files: util.pickImages(5) }}
          body={{
            grid: [
              { layout: { x: 0, y: 0, w: 2, h: 2 } },
              { layout: { x: 2, y: 0, w: 1, h: 2 } },
              { layout: { x: 3, y: 0, w: 2, h: 1 } },
              { layout: { x: 3, y: 1, w: 1, h: 1 } },
              { layout: { x: 4, y: 1, w: 1, h: 1 } }
            ]
          }}
          //uploadScript="http://localhost/lab/uploader/upload.php"
          uploadParamsConvertFunc={file => {
            return file.url;
          }}
          // updateStoreFunc={() => console.warn("update store")}
          ref={r => {
            this._photoLayoutEditor = r;
          }}
        />

        <button type="button" onClick={() => this.action("util.makeImage")}>
          Make image
        </button>

        <section>
          <h1>Make image area</h1>
          <figure id="makeImageArea" />
        </section>
      </div>
    );
  }
}

export default Layout;
