import axios from "axios";
import Static from "../../../StaticInfo";

export const fetchUser = () => async dispatch => {
  const res = await axios.get("/api/current_user");
  dispatch({
    type: Static.FETCH_USER,
    payload: res.data
  });
};

export const submitLogin = (value, history) => async dispatch => {
  const res = await axios.post("/api/login", value);
  if (res.data.message) {
    alert("error message: " + res.data.message);
  } else {
    history.push("/");
    dispatch({ type: Static.FETCH_USER, payload: res.data });
  }
};

export const submitSignup = (value, history) => async dispatch => {
  const res = await axios.post("/api/signup", value);
  console.log("after sign up " + JSON.stringify(res.data));
  if (res.data.err) {
    alert("error message: " + res.data.err);
  } else {
    history.push("/login");
    dispatch({ type: Static.SET_HIGHLIGHT, highlight: "login" });
  }
};
