import Static from "../../../StaticInfo";

export const dashboardReducer = (
  state = { collapsed: false, titleToggle: true },
  action
) => {
  switch (action.type) {
    case Static.COLLAPSE_SIDER:
      return { ...state, collapsed: !state.collapsed };
    case Static.TITTLE_TOGGLE:
      return { ...state, titleToggle: !state.titleToggle };
    default:
      return state;
  }
};
