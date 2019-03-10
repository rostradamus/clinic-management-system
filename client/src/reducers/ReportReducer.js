import { REPORT_ACTION_TYPE } from "../actions/ActionTypes";

const initialState = {
  isFetching: false,
  patients: [],
  err: null,
  searchText: "",
  popupInfo: {},
  openPopup: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REPORT_ACTION_TYPE.FETCH_PATIENTS_REQUEST:
      return Object.assign({}, state, { isFetching: true });

    case REPORT_ACTION_TYPE.FETCH_PATIENTS_SUCCESS:
      return Object.assign({}, state, { isFetching: false, patients: action.payload });

    case REPORT_ACTION_TYPE.FETCH_PATIENTS_FAILURE:
      return Object.assign({}, state, { isFetching: false, err: action.payload });

    case REPORT_ACTION_TYPE.SET_SEARCH_FIELD:
      return Object.assign({}, state, { searchText: action.payload });

    case REPORT_ACTION_TYPE.SET_INFO_FOR_POPUP:
      return Object.assign({}, state, { popupInfo: action.payload });

    case REPORT_ACTION_TYPE.OPEN_POPUP:
      return Object.assign({}, state, { openPopup: action.payload });

    case REPORT_ACTION_TYPE.CLOSE_POPUP:
      return Object.assign({}, state, { openPopup: action.payload });

    default:
      return state;
  }
};
