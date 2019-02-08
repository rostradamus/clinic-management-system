import { AUTH_ACTION_TYPE } from "actions/ActionTypes";
import axios from "axios";

export default class AuthAction {
  static fetchUser = (email, password) => {
    return async (dispatch) => {
      const res = await axios.post("/api/authenticate", {
        params: {
          email: email,
          password: password
        }
      });

      dispatch({
        type: AUTH_ACTION_TYPE.LOGIN_REQUEST,
        payload: res.data
      });
    }
  };

  static logoutUser = () => {
    return;
  }
}

