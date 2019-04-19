import Static from "../../../StaticInfo";

export const articleReducer = (
  state = {
    currentArticleId: "",
    currentContent: "",
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
        renderContent:action.renderContent
      };
    case Static.MODIFYRENDERCONTENT:
      return { ...state, renderContent: action.renderContent };
    default:
      return state;
  }
};
