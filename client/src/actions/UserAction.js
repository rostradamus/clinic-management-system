import { USER_ACTION_TYPE } from "actions/ActionTypes";
// import axios from "axios";
// TODO: [REMOVE] TEMP USERS FOR POC
import mockUsers from "./fixture/mockUser";

export default class UserAction {
  static getUsers() {
    return async dispatch => {
      dispatch({
        type: USER_ACTION_TYPE.FETCH_REQUEST,
        payload: {}
      });
      try {
        // TODO: [REMOVE] RETRIEVE MOCK USERS
        // const res = await axios.get(`/api/user`);
        const res = {data: mockUsers};
        dispatch({
          type: USER_ACTION_TYPE.FETCH_SUCCESS,
          payload: {
            items: res.data
          }
        });
      } catch (err) {
        dispatch({
          type: USER_ACTION_TYPE.FETCH_FAILURE,
          payload: {
            err: err
          }
        });
      }
    };
  }

  static getUser(id) {
    return async dispatch => {
      dispatch({
        type: USER_ACTION_TYPE.FETCH_REQUEST,
        payload: {}
      });
      try {
        // TODO: [REMOVE] RETRIEVE MOCK USERS
        // const res = await axios.get(`/api/user`);
        const res = { data: mockUsers.find(user => user.id === id) };
        dispatch({
          type: USER_ACTION_TYPE.FETCH_SUCCESS,
          payload: {
            selected: res.data
          }
        });
      } catch (err) {
        dispatch({
          type: USER_ACTION_TYPE.FETCH_FAILURE,
          payload: {
            err: err
          }
        });
      }
    };
  }

  static addUser(data) {

  }

  static editUser(data) {
    return async dispatch => {
      dispatch({
        type: USER_ACTION_TYPE.EDIT_REQUEST,
        payload: {}
      });
      try {
        // TODO: [REMOVE] RETRIEVE MOCK USERS
        // const res = await axios.put(`/api/user/${data.userId}`, data);
        const res = { data };
        dispatch({
          type: USER_ACTION_TYPE.EDIT_SUCCESS,
          payload: res.data
        });
      } catch (err) {
        dispatch({
          type: USER_ACTION_TYPE.EDIT_FAILURE,
          payload: {
            err: err
          }
        });
      }
    };
  }

  static deleteUser(id) {

  }

  static setFilter(filter) {
    return {
      type: USER_ACTION_TYPE.SET_FILTER,
      payload: { filter }
    };
  }

  static setSearchText(searchText) {
    return {
      type: USER_ACTION_TYPE.SET_SEARCH_TEXT,
      payload: { searchText }
    };
  }

  static setSort(key) {
    return {
      type: USER_ACTION_TYPE.SET_SORT,
      payload: key
    };
  }

  static openUserPopup(selectedUser) {
    return dispatch => dispatch({
      type: USER_ACTION_TYPE.OPEN_POPUP,
      payload: { popupUser: selectedUser }
    });
  }

  static closeUserPopup() {
    return dispatch => dispatch({
      type: USER_ACTION_TYPE.CLOSE_POPUP,
      payload: { popupUser: null }
    });
  }
}