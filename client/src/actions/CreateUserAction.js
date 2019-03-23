import { CREATE_USER_ACTION_TYPE } from "actions/ActionTypes";
import axios from "axios";
// new user // new admission record //
export default class CreateUserAction {
  static getPatient(mrn) {
    // result - patient data
    return async dispatch => {
      dispatch({
        type: CREATE_USER_ACTION_TYPE.FETCH_MRN_REQUEST,
        payload: {}
      });
      try {
        const res = await axios.get('/api/patients', {params: { mrn: mrn }});
        dispatch({
          type: CREATE_USER_ACTION_TYPE.FETCH_MRN_SUCCESS,
          payload:
            res.data
        });
      } catch (err) {
        dispatch({
          type: CREATE_USER_ACTION_TYPE.FETCH_MRN_FAILURE,
          payload: {
            err: err
          }
        });
      }
    };
  }

  static nextSlide(){
    return ({
      type: CREATE_USER_ACTION_TYPE.NEXT_SLIDE,
      payload:{}
    });
  }

  static prevSlide(){
    return ({
      type: CREATE_USER_ACTION_TYPE.PREV_SLIDE,
      payload:{}
    });
  }
  static closePopup(){
    return dispatch => dispatch({
      type: CREATE_USER_ACTION_TYPE.CLOSE_POPUP,
      payload:{}
    });
  }
  static openPopup() {
    return dispatch => dispatch({
      type: CREATE_USER_ACTION_TYPE.OPEN_POPUP,
      payload:{}
    });
  }
}
