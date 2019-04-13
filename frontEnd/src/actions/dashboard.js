import Static from "../../../StaticInfo";

export const collapseSider = () => {
  return dispatch => {
    dispatch({ type: Static.COLLAPSE_SIDER });
  };
};
