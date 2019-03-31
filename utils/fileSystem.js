const fs = require("fs-extra");
const path = require("path");
const chokidar = require("chokidar");

const ArticleFolder = path.join(__dirname, "../DataSystem/Articles");
const ImageFolder = path.join(__dirname, "../DataSystem/Images");

var initArticleAndImageFolder = () => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(ArticleFolder)) {
      fs.mkdir(ArticleFolder, { recursive: true }, err => {
        if (err) reject(err);
        resolve("Init Article Folder Successfully!");
      });
    }
    if (!fs.existsSync(ImageFolder)) {
      fs.mkdir(ImageFolder, { recursive: true }, err => {
        if (err) reject(err);
        resolve("Init Image Folder Successfully!");
      });
    }
  });
};

var createArticle = name => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(ArticleFolder, name + ".md");
    if (!fs.existsSync(filePath)) {
      fs.writeFile(filePath, "", err => {
        resolve(err ? err : "file created!");
      });
    } else {
      reject("file aleardy exists!");
    }
  });
};

var loadArticle = name => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(ArticleFolder, name + ".md");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

var saveArticle = (name, content) => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(ArticleFolder, name + ".md");
    fs.writeFile(filePath, content, "utf8", err => {
      if (err) {
        reject(err);
      }
      resolve("file save successfully!");
    });
  });
};

// console.log(createArticle("temp"));

// 测试文件读写
// let testReadAndWriteArticles = async () => {
//   try {
//     let mess = await loadArticle("temp");
//     mess = await saveArticle("temp", mess + "\nhahahahahah");
//     console.log(mess);
//   } catch (e) {
//     console.log(e);
//   }
// };

// 监听文件夹内容的改变
var listenArticles = dic => {
  chokidar.watch(dic, { ignored: /(^|[\/\\])\../ }).on("all", (event, path) => {
    console.log(event, path);
  });
};

// listenArticles(ArticleFolder);
// listenArticles(ImageFolder);

module.exports = {
  initArticleAndImageFolder,
  createArticle,
  loadArticle,
  saveArticle,
  listenArticles
};
