const dbSys = require("./dbSystem");
const fileSys = require("./fileSystem");

// 文章的 id 是核心。用户点击新建文件按钮，然后lowdb为其分配id，保存用户
// 设置的 title。使用id作为文章保存的文件名，避免重复。id被返回到前端对应到
// 新文章的 redux store中。
// 获取文章列表，后端直接将数据库的文章信息都反馈给前端就好不需要访问文件系统。
// 用户点击文章，前端将文章 id 发送到后端，后端直接读取文章，返回给前端，不需要走数据库。
// 用户保存文章，前端将文章 id 与 content 发送到后端，后端直接覆盖之前的文件，不需要走数据库。
// 用户重命名文章，前端将文章 id 与 新名称 发送到后端，后端直接修改数据库中保存的 title即可。

/**
 * 初始化文章与图片的本地保存位置
 * @returns {string} 文件夹是否创建成功的信息
 */
var initFilesFolder = async () => {
  let result = await fileSys.initArticleAndImageFolder();
  return result;
};

/**
 * 新建空文件
 *
 * @param {string} title 文件名称
 * @returns {} 文件的整个数据对象
 */
var createArticle = async title => {
  let article = dbSys.createArticle(title);
  let idOfArticle = article.id;
  if (idOfArticle) {
    let result = await fileSys.createArticle(idOfArticle);
    if (result === "file created!") {
      return article;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};

/**
 * 读取文件
 * TODO: 增加错误处理
 * @param {string} id 文件 id
 * @returns {string} 文件内容
 */
var loadArticle = async id => {
  let content = await fileSys.loadArticle(id);
  return content;
};

/**
 * 覆写文件
 * TODO: 增加错误处理
 * @param {string} id 文件 id
 * @param {string} content 新文件内容
 * @returns {string} 写回是否成功的信息
 */
var saveArticle = async (id, content) => {
  let result = await fileSys.saveArticle(id, content);
  return result;
};

/**
 * 删除一个文章所有的相关信息
 *
 * @param {*} id 文件 id
 * @returns 删除的文章在数据库中的信息
 */
var deleteArticle = async id => {
  // 删除文件夹中的文件
  try {
    let result = await fileSys.deleteArticle(id);
    console.log(result);
  } catch (e) {
    console.log(e);
  }
  // 删除db中的记录
  return dbSys.deleteArticle(id);
};

/**
 * 重命名文章
 *
 * @param {*} id 文章 id
 * @param {*} title 新文章名
 * @returns 文章数据库信息对象
 */
var renameArticle = async (id, title) => {
  let result = await dbSys.renameArticle(id, title);
  return result;
};

/**
 * 获取文章列表
 *
 * @returns 文章列表数组
 */
var getArticleList = async () => {
  let result = await dbSys.getArticleList();
  return result;
};

module.exports = {
  initFilesFolder,
  createArticle,
  loadArticle,
  saveArticle,
  renameArticle,
  getArticleList,
  deleteArticle
};

// getArticleList();

// var testCreateSaveRename = async () => {
//   let newId = await createArticle("test file");
//   let result = await saveArticle(newId, "this is me, here I am");
//   // let info = await renameArticle(newId, "Ting is here");
//   return info;
// };

// console.log(testCreateSaveRename());
