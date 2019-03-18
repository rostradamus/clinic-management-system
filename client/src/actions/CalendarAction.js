import { APPOINTMENT_ACTION_TYPE } from "actions/ActionTypes";
import axios from "axios";

export default class CalendarAction {

  static fetchAppointments = (user) => {
    return async dispatch => {
      try {
        const res = await axios.get(`/api/appointments/`, {
          params: { user_id: user.id }
        });

        dispatch({
          type: APPOINTMENT_ACTION_TYPE.FETCH_SUCCESS,
          payload: {
            events: res.data,
            selectedUser: user
          }
        });
      } catch (err) {
        dispatch({
          type: APPOINTMENT_ACTION_TYPE.FETCH_FAILURE,
          payload: {
            err: err
          }
        });
      }
    }
  };

  static createAppointment = data => {
    return async dispatch => {
      const res = await axios.post(`/api/appointments/`, data);
      try {
        dispatch({
          type: APPOINTMENT_ACTION_TYPE.CREATE_SUCCESS,
          payload: res.data
        });
      } catch (err) {
        dispatch({
          type: APPOINTMENT_ACTION_TYPE.CREATE_FAILURE,
          payload: data
        });
      }
    }
  };

  static updateAppointment = data => {
    return {
      type: APPOINTMENT_ACTION_TYPE.UPDATE_SUCCESS,
      payload: data
    }
  }
}