import Static from "../../../StaticInfo";

export const setHeaderHighlight = key => async dispatch => {
  dispatch({ type: Static.SET_HIGHLIGHT, highlight: key });
};
