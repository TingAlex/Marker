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
      return { ...state, articleList: action.articleList };
    case Static.ARTICLECONTENT:
      return {
        ...state,
        currentArticleId: action.id,
        currentContent: action.content,
        tempContent: action.content,
        renderContent: action.renderContent
      };
    case Static.MODIFYRENDERCONTENT:
      return {
        ...state,
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
    default:
      return state;
  }
};
