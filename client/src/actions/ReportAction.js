import { REPORT_ACTION_TYPE } from "./ActionTypes";
import axios from "axios";

export default class ReportAction {
  static getPatients = () => {
    return async (dispatch) => {
      try {
        const res = await axios.get(`/api/reports`);
        console.log("hererhrhehrehre", res.data);
        dispatch({ type: REPORT_ACTION_TYPE.FETCH_PATIENTS_SUCCESS, payload: res.data });
      } catch (err) {
        dispatch({ type: REPORT_ACTION_TYPE.FETCH_PATIENTS_FAILURE, payload: err });
      }
    };
  };

  static getPatient = (id) => {
    return async (dispatch) => {
      try {
        const res = await axios.get(`/api/reports/:${id}`);
        console.log(res);
        dispatch({ type: REPORT_ACTION_TYPE.FETCH_PATIENTS_SUCCESS, payload: res.data });
      } catch (err) {
        dispatch({ type: REPORT_ACTION_TYPE.FETCH_PATIENTS_FAILURE, payload: err });
      }
    };
  };

  static setInfoForPopup = (info) => {
    return (dispatch) => {
      dispatch({ type: REPORT_ACTION_TYPE.SET_INFO_FOR_POPUP, payload: info });
    };
  };

  static openPopup = () => {
    return (dispatch) => {
      dispatch({ type: REPORT_ACTION_TYPE.OPEN_POPUP, payload: true });
    };
  };

  static closePopup = () => {
    return (dispatch) => {
      dispatch({ type: REPORT_ACTION_TYPE.CLOSE_POPUP, payload: false });
    };
  };
}
