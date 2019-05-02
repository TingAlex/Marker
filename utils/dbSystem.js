const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const lodashId = require("lodash-id");
const moment = require("moment");

// lowdb 固定写法
const dbJson = path.join(__dirname, "../DataSystem/db.json");
const adapter = new FileSync(dbJson);
const db = low(adapter);

// 因为我需要 uid，所以额外引入了 lodash-id，要这样写
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
 * @returns 文章的整个数据对象
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

/**
 * 删除指定 id 的文章数据
 *
 * @param {*} id 文章 id
 * @returns 删除的文章的信息内容
 */
const deleteArticle = id => {
  return db
    .get(ARTICLES)
    .remove({ id })
    .write();
};

module.exports = {
  createArticle,
  renameArticle,
  getArticleList,
  deleteArticle
};

console.log(deleteArticle("b91e757c-b0a1-4aff-9cfa-02ffe2d4b3ea"));
// let newArt = createArticle("title");
// const article = db
//   .get(ARTICLES)
//   .getById(newArt.id)
//   .value();
// console.log(article);
// console.log(
//   renameArticle("56283cd7-3297-4742-a58c-6b254ff6d28e", "ting")
// );

// Set a user using Lodash shorthand syntax
// db.set("user.name", "typicode").write();

// Increment count
// db.update("count", n => n + 1).write();
