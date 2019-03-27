import { REPORT_ACTION_TYPE } from "../actions/ActionTypes";

const initialState = {
  patients: [],
  errorMessage: {},
  searchText: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REPORT_ACTION_TYPE.FETCH_PATIENTS_SUCCESS:{
      return Object.assign({...state}, { searchText: "", patients: action.payload });
    }

    case REPORT_ACTION_TYPE.FETCH_PATIENTS_FAILURE:{
      return Object.assign({...state}, { errorMessage: action.payload });
    }

    case REPORT_ACTION_TYPE.SET_SEARCH_TEXT: {
      return Object.assign({...state}, action.payload);
    }
    default:
      return state;
  }
};
