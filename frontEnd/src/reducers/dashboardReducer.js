import Static from "../../../StaticInfo";

export const dashboardReducer = (state = { collapsed: false }, action) => {
  switch (action.type) {
    case Static.COLLAPSE_SIDER:
      return { ...state, collapsed: !state.collapsed };
    default:
      return state;
  }
};
