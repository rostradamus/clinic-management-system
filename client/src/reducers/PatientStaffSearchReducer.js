import { PATIENT_STAFF_SEARCH_ACTION_TYPE } from "actions/ActionTypes";

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case PATIENT_STAFF_SEARCH_ACTION_TYPE.FETCH_SUCCESS : {
      const filteredResult = action.payload.items.filter(user => user.type === "Patient" || user.type === "Staff");
      return filteredResult;
    }
    case PATIENT_STAFF_SEARCH_ACTION_TYPE.FETCH_FAILURE: {
      return state;
    }
    default:
      return state;
  }
}