import Static from "../../../StaticInfo";

export const collapseSider = () => {
  return dispatch => {
    dispatch({ type: Static.COLLAPSE_SIDER });
  };
};

export const toggleTitle = () => {
  return dispatch => {
    dispatch({ type: Static.TITTLE_TOGGLE });
  };
};
