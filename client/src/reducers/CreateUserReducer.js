import { CREATE_USER_ACTION_TYPE } from "actions/ActionTypes";

const initialState = {
  isFetching: false,
  slideIndex:1,
  patient:{},
  popup: false
};

export default (state = initialState, action) => {
  const {slideIndex, patient} = state;
  switch (action.type) {
    case CREATE_USER_ACTION_TYPE.FETCH_MRN_REQUEST: {
      return Object.assign({...state}, {isFetching: true});
    }
    case CREATE_USER_ACTION_TYPE.FETCH_MRN_SUCCESS:{
      const index = action.payload.length > 0 ? slideIndex + 2 : slideIndex + 1;
      return Object.assign({...state}, {isFetching: false, slideIndex: index, patient: action.payload});
    }
    case CREATE_USER_ACTION_TYPE.FETCH_MRN_FAILURE:{
      return Object.assign({...state}, {isFetching: false}, action.payload);
    }
    case CREATE_USER_ACTION_TYPE.NEXT_SLIDE: {
      return Object.assign({...state}, {slideIndex: slideIndex + 1});
    }
    case CREATE_USER_ACTION_TYPE.PREV_SLIDE: {
      const index = patient.length > 0 ? slideIndex - 2 : slideIndex - 1;
      if(index === 1) return Object.assign({...initialState}, {popup: true});
      else return Object.assign({...state}, {slideIndex: index});
    }
    case CREATE_USER_ACTION_TYPE.CLOSE_POPUP: {
      return initialState;
    }
    case CREATE_USER_ACTION_TYPE.OPEN_POPUP: {
      return Object.assign({...state}, {popup: true});
    }
    default:
      return state;
    }
};