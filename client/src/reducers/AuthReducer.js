import { AUTH_ACTION_TYPE } from "actions/ActionTypes";

export default (state = null, action) => {
    switch(action.type) {
        case AUTH_ACTION_TYPE.LOGIN_REQUEST:
            return Object.assign({...state}, action.payload);
        default :
            return state;
    }
}