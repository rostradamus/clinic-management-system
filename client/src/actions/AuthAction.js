import { AUTH_ACTION_TYPE } from "actions/ActionTypes";
import axios from "axios";

export default class AuthAction {
  static checkUser = () => {
    return async dispatch => {
      dispatch({
        type: AUTH_ACTION_TYPE.LOGIN_REQUEST,
        payload: { isFetching: true }
      });
      let res;
      try {
        res = await axios.get("/api/user/session");
        dispatch({
          type: AUTH_ACTION_TYPE.LOGIN_SUCCESS,
          payload: {
            current_user: res.data,
            isFetching: false,
            hasLoggedIn: true
          }
        });
      } catch(err) {
        dispatch({
          type: AUTH_ACTION_TYPE.LOGIN_FAILURE,
          payload: { err }
        });
        throw err;
      }
    }
  };

  static loginUser = ({username, password}) => {
    return async dispatch => {
      dispatch({
        type: AUTH_ACTION_TYPE.LOGIN_REQUEST,
        payload: { isFetching: true }
      });
      let res;
      try {
        res = await axios.post("/api/user/session", {
          username: username,
          password: password
        });
        dispatch({
          type: AUTH_ACTION_TYPE.LOGIN_SUCCESS,
          payload: {
            current_user: res.data,
            isFetching: false,
            hasLoggedIn: true
          }
        });
      } catch(err) {
        dispatch({
          type: AUTH_ACTION_TYPE.LOGIN_FAILURE,
          payload: { err }
        });
        throw err;
      }
    }
  };

  static logoutUser = history => {
    return async dispatch => {
      dispatch({
        type: AUTH_ACTION_TYPE.LOGOUT_REQUEST,
        payload: { isFetching: true }
      });
      try {
        await axios.delete("/api/user/session");
        dispatch({
          type: AUTH_ACTION_TYPE.LOGOUT_SUCCESS,
          payload: {
            current_user: null,
            isFetching: false,
            hasLoggedIn: false
          }
        });
        history.push("/login");
      } catch(err) {
        dispatch({
          type: AUTH_ACTION_TYPE.LOGOUT_FAILURE,
          payload: { err }
        })
      }
    }
  };
};
