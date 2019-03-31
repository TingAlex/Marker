const path = require("path");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const lodashId = require("lodash-id");
const moment = require("moment");

const dbJson = path.join(__dirname, "../DataSystem/db.json");
const adapter = new FileSync(dbJson);
const db = low(adapter);
db._.mixin(lodashId);

// Set some defaults (required if your JSON file is empty)
db.defaults({ articles: [], images: [], user: {} }).write();
let ARTICLES = "articles";
let IMAGES = "images";
let USER = "user";

/**
 * 创建空文章信息
 *
 * @param {*} title 文章名
 * @returns 文章 id
 */
const createArticle = title => {
  return db
    .get(ARTICLES)
    .insert({
      title,
      folder: "default",
      webLocation: "",
      lastModefiedTime: new Date()
    })
    .write();
};

/**
 * 重命名文章
 *
 * @param {*} id 文章 id
 * @param {*} title 新文章名
 * @returns 文章数据库信息对象
 */
const renameArticle = (id, title) => {
  return db
    .get(ARTICLES)
    .getById(id)
    .assign({ title })
    .write();
};

/**
 * 获取文章列表
 *
 * @returns 文章列表数组
 */
const getArticleList = () => {
  return db
    .get(ARTICLES)
    .sortBy("lastModefiedTime")
    .value();
};

// let newArt = createArticle("title");
// const article = db
//   .get(ARTICLES)
//   .getById(newArt.id)
//   .value();
// console.log(article);
// console.log(
//   renameArticle("56283cd7-3297-4742-a58c-6b254ff6d28e", "ting")
// );

module.exports = {
  createArticle,
  renameArticle,
  getArticleList
};

// Set a user using Lodash shorthand syntax
// db.set("user.name", "typicode").write();

// Increment count
// db.update("count", n => n + 1).write();
