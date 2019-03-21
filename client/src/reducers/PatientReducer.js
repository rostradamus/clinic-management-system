import { PATIENT_ACTION_TYPE } from "actions/ActionTypes";

const initialState = {
  isFetching: false,
  isExistingPatient:false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PATIENT_ACTION_TYPE.FETCH_MRN_REQUEST: {
      return Object.assign({...state}, {isFetching: true, isExistingPatient: action.payload.length !== 0}, action.payload);
    }
    case PATIENT_ACTION_TYPE.FETCH_MRN_SUCCESS:
    case PATIENT_ACTION_TYPE.FETCH_MRN_FAILURE:{
      return Object.assign({...state}, {isFetching: false}, action.payload);
    }
    default:
      return state;
    }
};