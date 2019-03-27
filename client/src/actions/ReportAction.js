import { REPORT_ACTION_TYPE } from "./ActionTypes";
import axios from "axios";

export default class ReportAction {
  static getPatients = () => {
    return async (dispatch) => {
      try {
        const res = await axios.get(`/api/reports`);
        dispatch({
          type: REPORT_ACTION_TYPE.FETCH_PATIENTS_SUCCESS,
          payload: res.data
        });
      } catch (err) {
        dispatch({
          type: REPORT_ACTION_TYPE.FETCH_PATIENTS_FAILURE,
          payload: err.response.data
        });
      }
    };
  };

  static getPatient = (id) => {
    return async (dispatch) => {
      try {
        const res = await axios.get(`/api/reports/${id}`);
        dispatch({
          type: REPORT_ACTION_TYPE.FETCH_PATIENTS_SUCCESS,
          payload: res.data
        });
      } catch (err) {
        dispatch({
          type: REPORT_ACTION_TYPE.FETCH_PATIENTS_FAILURE,
          payload: err.response.data
        });
      }
    };
  };

  static setSearchText = searchText => {
    return {
      type: REPORT_ACTION_TYPE.SET_SEARCH_TEXT,
      payload: { searchText }
    };
  }
}
