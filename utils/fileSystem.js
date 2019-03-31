const fs = require("fs-extra");
const path = require("path");
const chokidar = require("chokidar");

const ArticleFolder = path.join(__dirname, "../DataSystem/Articles");
const ImageFolder = path.join(__dirname, "../DataSystem/Images");

/**
 * 初始化文章与图片的本地保存位置
 * @returns {string} 文件夹是否创建成功的信息
 */
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

/**
 * 新建空文件
 *
 * @param {string} title
 * @returns {string} 文章是否创建成功的信息
 */
var createArticle = title => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(ArticleFolder, title + ".md");
    if (!fs.existsSync(filePath)) {
      fs.writeFile(filePath, "", err => {
        resolve(err ? err : "file created!");
      });
    } else {
      reject("file aleardy exists!");
    }
  });
};

/**
 * 读取文件
 *
 * @param {*} title 文章标题，其实也就是文章 id
 * @returns 报错信息或是文章内容
 */
var loadArticle = title => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(ArticleFolder, title + ".md");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

/**
 * 覆写文件
 *
 * @param {string} title 文章标题，其实也就是文章 id
 * @param {string} content 新文件内容
 * @returns 写回是否成功的信息
 */
var saveArticle = (title, content) => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(ArticleFolder, title + ".md");
    fs.writeFile(filePath, content, "utf8", err => {
      if (err) {
        reject(err);
      }
      resolve("file save successfully!");
    });
  });
};

/**
 * 监听文件夹内容的改变
 * TODO: 利用监听做什么？想清楚
 * @param {string} dic
 */
var listenArticles = dic => {
  chokidar.watch(dic, { ignored: /(^|[\/\\])\../ }).on("all", (event, path) => {
    console.log(event, path);
  });
};

module.exports = {
  initArticleAndImageFolder,
  createArticle,
  loadArticle,
  saveArticle,
  listenArticles
};

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

// 监听两个文件夹变化
// listenArticles(ArticleFolder);
// listenArticles(ImageFolder);
