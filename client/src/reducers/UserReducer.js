import { USER_ACTION_TYPE } from "actions/ActionTypes";

const initialState = {
  isFetching: false,
  filter: "all",
  searchText: "",
  sort: {
    key: "",
    direction: "ascending"
  },
  items: [],
  popupUser: null,
  err: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_ACTION_TYPE.FETCH_REQUEST:
    case USER_ACTION_TYPE.ADD_REQUEST:
    case USER_ACTION_TYPE.EDIT_REQUEST:
    case USER_ACTION_TYPE.DELETE_REQUEST: {
      return Object.assign({...state}, {isFetching: true}, action.payload);
    }
    case USER_ACTION_TYPE.FETCH_SUCCESS:
    case USER_ACTION_TYPE.FETCH_FAILURE:
    case USER_ACTION_TYPE.ADD_SUCCESS:
    case USER_ACTION_TYPE.ADD_FAILURE:
    case USER_ACTION_TYPE.EDIT_FAILURE:
    case USER_ACTION_TYPE.DELETE_SUCCESS:
    case USER_ACTION_TYPE.DELETE_FAILURE: {
      return Object.assign({...state}, {isFetching: false}, action.payload);
    }

    case USER_ACTION_TYPE.EDIT_SUCCESS: {
      const items = state.items.map(user =>
        user.userId === action.payload.userId ? action.payload : user);
      return Object.assign({...state}, { items });
    }
    case USER_ACTION_TYPE.SET_SORT: {
      const { key, direction } = state.sort;
      const newDirection = (key !== action.payload) ? "ascending" :
        (direction === "ascending" ? "descending" : "ascending");
      return Object.assign({...state}, { sort: { key: action.payload, direction: newDirection } });
    }
    case USER_ACTION_TYPE.OPEN_POPUP:
    case USER_ACTION_TYPE.CLOSE_POPUP:
    case USER_ACTION_TYPE.SET_FILTER:
    case USER_ACTION_TYPE.SET_SEARCH_TEXT: {
      return Object.assign({...state}, action.payload);
    }
    default:
      return state;
    }
};
