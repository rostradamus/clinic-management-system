import { APPOINTMENT_ACTION_TYPE } from "actions/ActionTypes";

const initialState = {
  events: [],
  selectedUser: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case APPOINTMENT_ACTION_TYPE.FETCH_SUCCESS: {
      return Object.assign({...state}, {...action.payload});
    }
    case APPOINTMENT_ACTION_TYPE.UPDATE_APPOINTMENT_FAILURE: {
      return Object.assign({...state}, {...action.payload});
    }

    case APPOINTMENT_ACTION_TYPE.CREATE_SUCCESS: {
      return Object.assign({...state},
        { events: [...state.events, action.payload] }
      );
    }

    case APPOINTMENT_ACTION_TYPE.CREATE_FAILURE: {
      return state;
    }

    case APPOINTMENT_ACTION_TYPE.UPDATE_SUCCESS:
    case APPOINTMENT_ACTION_TYPE.UPDATE_FAILURE: {
      return state;
    }

    default:
      return state;
    }
};