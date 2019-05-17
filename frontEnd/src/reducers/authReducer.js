import Static from "../../../StaticInfo";
export const authReducer = (state = null, action) => {
  switch (action.type) {
    case Static.FETCH_USER:
      return action.payload || false;
    default:
      return state;
  }
};
// case Static.LOGIN_ERROR:
//   return action.payload || false;
