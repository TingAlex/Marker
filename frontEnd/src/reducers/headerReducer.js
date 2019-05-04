import Static from "../../../StaticInfo";

export const headerReducer = (state = { highlight: "dashboard" }, action) => {
  switch (action.type) {
    case Static.SET_HIGHLIGHT:
      return { ...state, highlight: action.highlight };
    default:
      return state;
  }
};
