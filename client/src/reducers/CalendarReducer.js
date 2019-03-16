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

    case APPOINTMENT_ACTION_TYPE.CREATE_APPOINTMENT_SUCCESS: {
      const updatedEvents = state.map(event => event.id === action.payload.id ? action.payload : event);
      return updatedEvents;
    }
    case APPOINTMENT_ACTION_TYPE.CREATE_APPOINTMENT_FAILURE: {
      return state;
    }

    case APPOINTMENT_ACTION_TYPE.UPDATE_APPOINTMENT_SUCCESS:
    case APPOINTMENT_ACTION_TYPE.UPDATE_APPOINTMENT_FAILURE: {
      return state;
    }

    default:
      return state;
    }
};