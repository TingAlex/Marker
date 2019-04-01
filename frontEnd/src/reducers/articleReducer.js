export const articleReducer = (
  state = { currentArticle: {}, articleList: [] },
  action
) => {
  switch (action.type) {
    case "ARTICLELIST":
      return { ...state, articleList: action.articleList };
    default:
      return state;
  }
};
