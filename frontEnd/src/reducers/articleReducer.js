import Static from "../../../StaticInfo";

export const articleReducer = (
  state = {
    currentArticleId: "",
    currentContent: "",
    // 每次修改内容后都会保存在这里，留待保存时使用
    tempContent: "",
    renderContent: "",
    articleList: []
  },
  action
) => {
  switch (action.type) {
    case Static.ARTICLELIST:
      return { ...state, articleList: [...action.articleList] };
    case Static.ARTICLECONTENT:
      return {
        ...state,
        currentArticleId: action.id,
        currentContent: action.content,
        tempContent: action.content,
        renderContent: action.renderContent
      };
    case Static.MODIFY_RENDER_CONTENT:
      return {
        ...state,
        tempContent: action.content,
        renderContent: action.renderContent
      };
    case Static.MODIFY_CURRENT_CONTENT:
      return {
        ...state,
        currentContent: action.content,
        tempContent: action.content,
        renderContent: action.renderContent
      };
    case Static.MODIFY_TITLE:
      let temp = [...state.articleList];
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].id === state.currentArticleId) {
          temp[i].title = action.title;
        }
      }
      return { ...state, articleList: temp };
    case Static.ADD_ARTICLE:
      return {
        ...state,
        currentArticleId: action.article.id,
        currentContent: "",
        // 每次修改内容后都会保存在这里，留待保存时使用
        tempContent: "",
        renderContent: "",
        articleList: [action.article, ...state.articleList]
      };
    case Static.REMOVE_ARTICLE:
      return {
        currentArticleId: "",
        currentContent: "",
        // 每次修改内容后都会保存在这里，留待保存时使用
        tempContent: "",
        renderContent: "",
        articleList: state.articleList.filter(item => {
          return item.id !== action.id;
        })
      };
    case Static.UPDATE_AN_ARTICLE_INFO:
      let tempList = [...state.articleList];
      for (let i = 0; i < tempList.length; i++) {
        if (tempList[i].id === action.article.id) {
          tempList[i] = action.article;
        }
      }
      return { ...state, articleList: tempList };
    default:
      return state;
  }
};
