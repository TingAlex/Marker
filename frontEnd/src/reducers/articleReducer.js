import Static from "../../../StaticInfo";

export const articleReducer = (
  state = { currentArticle: {}, articleList: [] },
  action
) => {
  switch (action.type) {
    case Static.ARTICLELIST:
      return { ...state, articleList: action.articleList };
    default:
      return state;
  }
};
