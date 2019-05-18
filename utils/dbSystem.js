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
      lastModefiedTime: new Date(),
      published: false,
      publicLink: "",
      pics: []
    })
    .write();
};

/**
 * 将图片信息写入到文章的图列表中
 *
 * @param {*} fileName 图片名称
 * @param {*} articleId 所属文章 id
 * @returns 关于这张图片的一条json信息
 */
const savePicToArticle = (fileName, articleId) => {
  return db
    .get(ARTICLES)
    .getById(articleId)
    .get("pics")
    .insert({ title: fileName })
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
 * 对文章中可能修改过的图片名进行保存
 *
 * @param {*} picId 图片 id
 * @param {*} title 图片新 title
 * @param {*} articleId 图片所属文章 id
 * @returns 修改成功的图片信息
 */
const renamePicOfArticle = (picId, title, articleId) => {
  return db
    .get(ARTICLES)
    .getById(articleId)
    .get("pics")
    .getById(picId)
    .assign({ title })
    .write();
};

const setPublicStateOfArticle = (articleId, webLink) => {
  return db
    .get(ARTICLES)
    .getById(articleId)
    .assign({ published: true, publicLink: webLink })
    .write();
};

const setPrivateStateOfArticle = articleId => {
  return db
    .get(ARTICLES)
    .getById(articleId)
    .assign({ published: false, publicLink: "" })
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
 * 获取文章保存与相应文件夹下的图列表信息
 *
 * @param {*} id 文章 id
 * @returns Array 图列表
 */
const getArticlePicsInfo = id => {
  return db
    .get(ARTICLES)
    .getById(id)
    .get("pics")
    .value();
};

/**
 * 获取一篇文章的所有信息
 *
 * @param {*} id 文章 id
 * @returns {} 文章信息
 */
const getArticleInfo = id => {
  return db
    .get(ARTICLES)
    .getById(id)
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

/**
 * 从文章的图列表中删除图片信息
 *
 * @param {*} picId 图片 id
 * @param {*} articleId 文章 id
 * @returns 删除的图片的信息内容
 */
const deletePicInfoFromArticle = (picId, articleId) => {
  return db
    .get(ARTICLES)
    .getById(articleId)
    .get("pics")
    .remove({ id: picId })
    .write();
};

module.exports = {
  createArticle,
  renameArticle,
  getArticleList,
  deleteArticle,
  savePicToArticle,
  getArticlePicsInfo,
  getArticleInfo,
  renamePicOfArticle,
  deletePicInfoFromArticle,
  setPublicStateOfArticle,
  setPrivateStateOfArticle
};

// console.log(
//   savePicToArticle("image.png", "4c3ebc86-6f08-4bd4-81fd-be293f7f83e4")
// );
// console.log(deleteArticle("b91e757c-b0a1-4aff-9cfa-02ffe2d4b3ea"));
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
