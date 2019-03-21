import { PATIENT_ACTION_TYPE } from "actions/ActionTypes";
import axios from "axios";
// new user // new admission record //
export default class PatientAction {
  static getPatient(mrn) {
    // result - patient data
    return async dispatch => {
      dispatch({
        type: PATIENT_ACTION_TYPE.FETCH_MRN_REQUEST,
        payload: {}
      });
      try {
        const res = await axios.get("/api/patients/", {params: { mrm: mrn.id }});
        dispatch({
          type: PATIENT_ACTION_TYPE.FETCH_MRN_SUCCESS,
          payload: {
            selected: res.data
          }
        });
      } catch (err) {
        dispatch({
          type: PATIENT_ACTION_TYPE.FETCH_MRN_FAILURE,
          payload: {
            err: err
          }
        });
      }
    };
  }
}