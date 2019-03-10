import { REPORT_ACTION_TYPE } from "./ActionTypes";
import { mockPatients } from "./mockPatients";

import axios from "axios";

export default class ReportAction {
  static getPatients = () => {
    return async (dispatch) => {
      dispatch({ type: REPORT_ACTION_TYPE.FETCH_PATIENTS_SUCCESS, payload: mockPatients });
      // temporally commented out for demo
      //
      // dispatch({ type: REPORT_ACTION_TYPE.FETCH_PATIENTS_REQUEST, payload: {} });
      // try {
      //  // const res = await axios.get(`/api/report`);
      //  dispatch({ type: REPORT_ACTION_TYPE.FETCH_PATIENTS_SUCCESS, payload: mockPatients });
      // } catch (err) {
      //  dispatch({ type: REPORT_ACTION_TYPE.FETCH_PATIENTS_FAILURE, payload: err });
      // }
    };
  };

  static setSearch = (inputStr) => {
    return (dispatch) => {
      dispatch({ type: REPORT_ACTION_TYPE.SET_SEARCH_FIELD, payload: inputStr });
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
