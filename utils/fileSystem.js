const fs = require("fs-extra");
const path = require("path");
const chokidar = require("chokidar");
const Static = require("../StaticInfo");

// const Static.ARTICLE_FOLDER = path.join(__dirname, "../DataSystem/Articles");
// const Static.IMAGE_FOLDER = path.join(__dirname, "../DataSystem/Images");

/**
 * 初始化文章与图片的本地保存位置
 * @returns {string} 文件夹是否创建成功的信息
 */
var initArticleAndImageFolder = () => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(Static.ARTICLE_FOLDER)) {
      fs.mkdir(Static.ARTICLE_FOLDER, { recursive: true }, err => {
        if (err) reject(err);
        resolve("Init Article Folder Successfully!");
      });
    }
    if (!fs.existsSync(Static.IMAGE_FOLDER)) {
      fs.mkdir(Static.IMAGE_FOLDER, { recursive: true }, err => {
        if (err) reject(err);
        resolve("Init Image Folder Successfully!");
      });
    }
  });
};

/**
 * 新建空文件
 *
 * @param {string} id
 * @returns {string} 文章是否创建成功的信息
 */
var createArticle = id => {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.join(Static.ARTICLE_FOLDER, id));
    let filePath = path.join(Static.ARTICLE_FOLDER, id, id + ".md");
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
 * 保存剪贴板粘贴过来的图片
 *
 * @param {*} base64Pic 图片的base64编码
 * @param {*} articleId 目标文章 id（也是图片保存的目标文件夹名称）
 * @param {*} picId db 为这张图片生成的 id
 * @returns {absolutePath, mess}
 */
var createPic = (base64Pic, articleId, picId) => {
  var base64Data = base64Pic.replace(/^data:image\/\w+;base64,/, "");
  var dataBuffer = new Buffer(base64Data, "base64");
  let picPath = path.join(Static.ARTICLE_FOLDER, articleId, picId + ".png");
  return new Promise((resolve, reject) => {
    fs.writeFile(picPath, dataBuffer, err => {
      if (err) {
        reject(err);
      } else {
        resolve({ absolutePath: picPath, mess: "The file has been saved!" });
      }
    });
  });
};

/**
 * 读取文件
 *
 * @param {*} id 文章实际保存的文件名称
 * @returns 报错信息或是文章内容
 */
var loadArticle = id => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(Static.ARTICLE_FOLDER, id, id + ".md");
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
 * @param {string} id 文章实际保存的文件名称
 * @param {string} content 新文件内容
 * @returns 写回是否成功的信息
 */
var saveArticle = (id, content) => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(Static.ARTICLE_FOLDER, id, id + ".md");
    fs.writeFile(filePath, content, "utf8", err => {
      if (err) {
        reject(err);
      }
      resolve("file save successfully!");
    });
  });
};

/**
 * 删除文件所在的整个文件夹！
 *
 * @param {*} id 文件 id
 * @returns 是否成功删除的信息
 */
var deleteArticle = id => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(Static.ARTICLE_FOLDER, id);
    let files = [];
    files = fs.readdirSync(filePath);
    files.forEach((file, index) => {
      fs.unlinkSync(filePath + "/" + file);
    });
    fs.rmdir(filePath, err => {
      if (err) {
        reject(err);
      }
      resolve("file remove successfully!");
    });
  });
};

/**
 * 删除文章所在文件夹的指定图片
 *
 * @param {*} picId 图片 id
 * @param {*} articleId 文章 id,也是文章所在文件夹名称
 * @returns 是否成功删除的信息
 */
var deletePicFromArticle = (picId, articleId) => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(Static.ARTICLE_FOLDER, articleId, picId + ".png");
    fs.unlink(filePath, err => {
      if (err) {
        reject(err);
      }
      resolve(picId + " pic remove successfully!");
    });
  });
};

/**
 * 将本地其他位置的图片复制到文章所在文件夹下
 *
 * @param {*} picPath 原图片地址
 * @param {*} articleId 目标文章 id
 * @param {*} picId 图片 id，也是它的新名称
 * @returns {absolutePath, mess}
 */
var saveLocalPic = (picPath, articleId, picId) => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(Static.ARTICLE_FOLDER, articleId, picId + ".png");
    fs.copyFile(picPath, filePath, err => {
      if (err) {
        reject(err);
      }
      resolve({
        absolutePath: filePath,
        mess: picPath + " was copied to " + filePath
      });
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
  listenArticles,
  deleteArticle,
  createPic,
  deletePicFromArticle,
  saveLocalPic
};

// 测试文件删除
// let testDeleteFile = async () => {
//   try {
//     let result = await deleteArticle("c777cb11-275a-4340-ab33-59b0940f99ca");
//     console.log(result);
//   } catch (e) {
//     console.log(e);
//   }
// };

// testDeleteFile();

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
