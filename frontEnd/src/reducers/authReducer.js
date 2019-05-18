import Static from "../../../StaticInfo";
export const authReducer = (state = null, action) => {
  switch (action.type) {
    case Static.FETCH_USER:
      // 点击登出后，再获取用户只会得到空字符串，这种情况下把结果明确设置为 false 合理些
      return action.payload || false;
    default:
      return state;
  }
};
// case Static.LOGIN_ERROR:
//   return action.payload || false;
