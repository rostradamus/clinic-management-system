import { APPOINTMENT_ACTION_TYPE } from "actions/ActionTypes";
// import axios from "axios";
import mockData from 'components/containers/calendar/mockData';

export default class CalendarPopupAction {

  static fetchAppointments = () => {
    return {
      type: APPOINTMENT_ACTION_TYPE.FETCH_APPOINTMENTS,
      payload: mockData
    }
  };

  static createAppointment = data => {
    return {
      type: APPOINTMENT_ACTION_TYPE.CREATE_APPOINTMENT_REQUEST,
      payload: data
    };
  };

  static updateAppointment = data => {
    return {
      type: APPOINTMENT_ACTION_TYPE.UPDATE_APPOINTMENT_REQUEST,
      payload: data
    }
  }
}