import { AUTH_ACTION_TYPE } from "actions/ActionTypes";

const initialState = {
  current_user: null,
  hasLoggedIn: false,
  isFetching: false,
  err: null
}

export default (state = initialState, action) => {
    switch(action.type) {
        case AUTH_ACTION_TYPE.LOGIN_REQUEST:
        case AUTH_ACTION_TYPE.LOGIN_SUCCESS:
        case AUTH_ACTION_TYPE.LOGIN_FAILURE:
        case AUTH_ACTION_TYPE.LOGOUT_REQUEST:
        case AUTH_ACTION_TYPE.LOGOUT_SUCCESS:
        case AUTH_ACTION_TYPE.LOGOUT_FAILURE:
            return Object.assign({...state}, action.payload);
        default:
            return state;
    }
}