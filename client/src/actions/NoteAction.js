import { NOTE_ACTION_TYPE } from "actions/ActionTypes";
import axios from "axios";

export default class NoteAction {
  static getNotes() {
    return async dispatch => {
      dispatch({
        type: NOTE_ACTION_TYPE.FETCH_REQUEST,
        payload: {
          isFetching: true
        }
      });
      try {
        const res = await axios.get(`/api/note`);
        dispatch({
          type: NOTE_ACTION_TYPE.FETCH_SUCCESS,
          payload: {
            isFetching: false,
            items: res.data
          }
        });
      } catch (err) {
        dispatch({
          type: NOTE_ACTION_TYPE.FETCH_FAILURE,
          payload: {
            isFetching: false,
            err: err
          }
        });
      }
    };
  }

  static getNote(id) {
    return async dispatch => {
      dispatch({
        type: NOTE_ACTION_TYPE.FETCH_REQUEST,
        payload: {
          isFetching: true
        }
      });
      try {
        const res = await axios.get(`/api/note/${id}`);
        dispatch({
          type: NOTE_ACTION_TYPE.FETCH_SUCCESS,
          payload: {
            isFetching: false,
            selected: res.data
          }
        });
      } catch (err) {
        dispatch({
          type: NOTE_ACTION_TYPE.FETCH_FAILURE,
          payload: {
            isFetching: false,
            err: err
          }
        });
      }
    };
  }

  static addNote(data) {

  }

  static deleteNote(id) {

  }
}