import { NOTE_ACTION_TYPE } from "actions/ActionTypes";

const initialState = {
  isFetching: false,
  items: [],
  selected: {},
  err: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NOTE_ACTION_TYPE.FETCH_REQUEST:
    case NOTE_ACTION_TYPE.ADD_REQUEST:
    case NOTE_ACTION_TYPE.DELETE_REQUEST: {
      return Object.assign({...state}, {isFetching: true}, action.payload);
    }
    case NOTE_ACTION_TYPE.FETCH_SUCCESS:
    case NOTE_ACTION_TYPE.FETCH_FAILURE:
    case NOTE_ACTION_TYPE.ADD_SUCCESS:
    case NOTE_ACTION_TYPE.ADD_FAILURE:
    case NOTE_ACTION_TYPE.DELETE_SUCCESS:
    case NOTE_ACTION_TYPE.DELETE_FAILURE: {
      return Object.assign({...state}, {isFetching: false}, action.payload);
    }
    default:
      return state;
    }
};
