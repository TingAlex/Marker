const Static = require("../StaticInfo");
const path = require("path");
const dbSys = require("./dbSystem");
const fileSys = require("./fileSystem");
const oper = require("./oper");

/**
 * 将![XX](XX)这样的图片信息从 content 中切分出来
 *
 * @param {*} content 待分割的 content
 * @returns {Array,Array} 根据图信息分割好的content数组，以及图信息所在index的数组
 */
const splitContentByPics = content => {
  let arr = content.split(/(![\[].*]\(.*\))/g);
  let picIndexArray = [];
  arr.forEach((item, index) => {
    if (item.match(/(![\[].*]\(.*\))/)) {
      picIndexArray.push(index);
    }
  });
  return { contentArr: arr, picIndexArray };
};

/**
 * 根据图信息不同，分成三种情况处理分割好的content，更新好db与file之后写回新的content
 *
 * @param {*} { contentArr, picIndexArray } 根据图信息分割好的content数组，以及图信息所在index的数组
 * @param {*} currentArticleId 目标文章 id
 * @param {*} prevPicsInfo 目标文章先前保存的图列表信息
 * @returns 更新后的 content
 */
const processPicAddressExpWebLink = async (
  { contentArr, picIndexArray },
  currentArticleId,
  prevPicsInfo
) => {
  // 生成数组的拷贝，否则 prevPicsInfo 还会随着 db.json 内容的改变而改变其中的值，后续对比时就会出错！
  let prevPicsInfoCopy = [...prevPicsInfo];
  // node path 生成的路径不能拿到前端直接使用，还是需要将分隔符转一下，并且 C 这个盘符需要大写
  let currentArticlePath = path
    .join(Static.ARTICLE_FOLDER, currentArticleId)
    .replace(/\\/g, "/");
  currentArticlePath =
    currentArticlePath[0].toUpperCase() + currentArticlePath.substring(1);
  // 遍历图信息
  // set 中装新文章的本地链接，方便比较出哪些原文章中的本地链接图片不见了
  let newPicsInfo = new Set();
  for (let i = 0; i < picIndexArray.length; i++) {
    let str = contentArr[picIndexArray[i]];
    // address 中保存*地址*，作为后续判断的参照
    let [full, title, address] = /![\[](.*)]\((.*)\)/.exec(str);
    console.log("address: ", address);
    if (address.indexOf(currentArticlePath) !== -1) {
      // 一定为本文章本地地址
      let picId = path.basename(address, ".png");
      dbSys.renamePicOfArticle(picId, title, currentArticleId);
      // 将新文章的本地链接添加到 set 中
      newPicsInfo.add(picId);
    } else if (address.indexOf("http") === 0) {
      // 一定为网络地址，不进行操作
    } else {
      // 一定为本地其他位置的地址
      // 图片信息{title，id}存储到文章图列表中，复制图片到本文章所在文件夹
      // 用新的绝对路径更新这个原图片描述段
      let absolutePath = await oper.saveOtherLocalPic(
        title,
        address,
        currentArticleId
      );
      // node path 生成的路径不能拿到前端直接使用，还是需要将分隔符转一下，并且 C 这个盘符需要大写
      absolutePath = absolutePath.replace(/\\/g, "/");
      absolutePath = absolutePath[0].toUpperCase() + absolutePath.substring(1);
      // 将新的路径写回到content的数组中的对应项中
      contentArr[picIndexArray[i]] = `![${title}](${absolutePath})`;
    }
  }
  // 遍历原文章本地图片链接，不用的图片删除掉。既要删除文章的图片表中的信息，也要删除图片文件。
  for (let j = 0; j < prevPicsInfoCopy.length; j++) {
    if (!newPicsInfo.has(prevPicsInfoCopy[j].id)) {
      let result = await removePicFromArticle(
        prevPicsInfoCopy[j].id,
        currentArticleId
      );
    }
  }
  // 将切分的数组再拼接回content，将更新的content保存到文件中，再返回
  let newContent = contentArr.join("");
  let result = await oper.saveArticle(currentArticleId, newContent);
  console.log(newContent);
  return newContent;
};

/**
 * 移除一个图片在 db 中的信息与图片文件
 *
 * @param {*} picId 图片 id
 * @param {*} articleId 文章 id
 */
const removePicFromArticle = async (picId, articleId) => {
  let result = dbSys.deletePicInfoFromArticle(picId, articleId);
  console.log("db: ", result);
  let mess = await fileSys.deletePicFromArticle(picId, articleId);
  console.log("file: ", mess);
};

/**
 * 专门处理保存文章后选择发布时，将网链的图片下载到本地，更新好db与file之后写回新的content
 *
 * @param {*} { contentArr, picIndexArray } 根据图信息分割好的content数组，以及图信息所在index的数组
 * @param {*} currentArticleId 目标文章 id
 * @returns  更新后的 content
 */
const processPicAddressOnlyWebLink = async (
  { contentArr, picIndexArray },
  currentArticleId
) => {
  // node path 生成的路径不能拿到前端直接使用，还是需要将分隔符转一下，并且 C 这个盘符需要大写
  let currentArticlePath = path
    .join(Static.ARTICLE_FOLDER, currentArticleId)
    .replace(/\\/g, "/");
  currentArticlePath =
    currentArticlePath[0].toUpperCase() + currentArticlePath.substring(1);
  // 遍历图信息
  for (let i = 0; i < picIndexArray.length; i++) {
    let str = contentArr[picIndexArray[i]];
    // address 中保存*地址*，作为后续判断的参照
    let [full, title, address] = /![\[](.*)]\((.*)\)/.exec(str);
    console.log("address: ", address);
    if (address.indexOf("http") === 0) {
      // 一定为网络地址，将网络图片保存下来
      let absolutePath = await oper.saveWebPic(
        title,
        address,
        currentArticleId
      );
      // node path 生成的路径不能拿到前端直接使用，还是需要将分隔符转一下，并且 C 这个盘符需要大写
      absolutePath = absolutePath.replace(/\\/g, "/");
      absolutePath = absolutePath[0].toUpperCase() + absolutePath.substring(1);
      // 将新的路径写回到content的数组中的对应项中
      contentArr[picIndexArray[i]] = `![${title}](${absolutePath})`;
    }
  }
  // 将切分的数组再拼接回content，将更新的content保存到文件中，再返回
  let newContent = contentArr.join("");
  let result = await oper.saveArticle(currentArticleId, newContent);
  console.log(newContent);
  return newContent;
};

/**
 * 用于处理不包含网络图片链接的文章保存操作。
 *
 * @param {*} articleId 文章 id
 * @param {*} content 文章内容
 * @returns 处理后且已保存的新文章内容
 */
const saveAndProcessArticleExpWebLink = async (articleId, content) => {
  let splitedContent = await splitContentByPics(content);
  let prevPicsInfo = await dbSys.getArticlePicsInfo(articleId);
  return await processPicAddressExpWebLink(
    splitedContent,
    articleId,
    prevPicsInfo
  );
};

/**
 * 仅用于处理文章中网络图片链接的文章保存操作。
 *
 * @param {*} articleId
 * @param {*} content
 * @returns 处理后且已保存的新文章内容
 */
const saveAndProcessArticleOnlyWebLink = async (articleId, content) => {
  let splitedContent = await splitContentByPics(content);
  // 因为一定是先保存后才可以执行这个函数，所以不再需要提取以前的图列表信息了。
  return await processPicAddressOnlyWebLink(splitedContent, articleId);
};

module.exports = {
  saveAndProcessArticleExpWebLink,
  saveAndProcessArticleOnlyWebLink
};

// const content = `this is me, here I am
// this is me, here I am
// this is me, here I am
// this is me, here I am
// tingtweraweferthsrtgaer

// ![imageTestName](C:/Users/Ting/Documents/Elec/marker/markerElec/DataSystem/Articles/a8acdc3c-b577-4fb7-a197-adf2244169d8/8b97e49a-fe0a-4a32-bf96-2094ad78988e.png)

// ergaerg

// ![haha.png](C:/Users/Ting/Downloads/temmp/toSave.png)

// ergaerg`;

// let testId = "a8acdc3c-b577-4fb7-a197-adf2244169d8";

// arga

// ![image.png](C:/Users/Ting/Documents/Elec/marker/markerElec/DataSystem/Articles/a8acdc3c-b577-4fb7-a197-adf2244169d8/bbdd2b1e-694c-40f9-9c32-22da3298cc90.png)
