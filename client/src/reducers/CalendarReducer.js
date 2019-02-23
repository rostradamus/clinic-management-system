import { APPOINTMENT_ACTION_TYPE } from "actions/ActionTypes";

const initialState = {
  "patient": "",
  "practitioner": "",
  "appointmentDate": "",
  "start": "",
  "end": "",
  "repeat": "never",
  "location": "",
  "notes": ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case APPOINTMENT_ACTION_TYPE.FETCH_APPOINTMENTS:
      return action.payload;

    case APPOINTMENT_ACTION_TYPE.CREATE_APPOINTMENT_REQUEST:
      return [...state, action.payload]

    case APPOINTMENT_ACTION_TYPE.CREATE_APPOINTMENT_SUCCESS:
    case APPOINTMENT_ACTION_TYPE.CREATE_APPOINTMENT_FAILURE:
      return state;

    case APPOINTMENT_ACTION_TYPE.UPDATE_APPOINTMENT_REQUEST:
      const updatedEvents = state.map(event => event.id === action.payload.id ? action.payload : event);
      return updatedEvents;

    case APPOINTMENT_ACTION_TYPE.UPDATE_APPOINTMENT_SUCCESS:
    case APPOINTMENT_ACTION_TYPE.UPDATE_APPOINTMENT_FAILURE:
      return state;
    default:
      return [];
    }
};