export const NOTE_ACTION_TYPE = {
  FETCH_REQUEST: "NOTE_FETCH_REQUEST",
  FETCH_SUCCESS: "NOTE_FETCH_SUCCESS",
  FETCH_FAILURE: "NOTE_FETCH_FAILURE",

  ADD_REQUEST: "NOTE_ADD_REQUEST",
  ADD_SUCCESS: "NOTE_ADD_SUCCESS",
  ADD_FAILURE: "NOTE_ADD_FAILURE",

  DELETE_REQUEST: "NOTE_DELETE_REQUEST",
  DELETE_SUCCESS: "NOTE_DELETE_SUCCESS",
  DELETE_FAILURE: "NOTE_DELETE_FAILURE"
};

export const AUTH_ACTION_TYPE = {
  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT_REQUEST: "LOGOUT_REQUEST",
  LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
  LOGOUT_FAILURE: "LOGOUT_FAILURE"
};

export const APPOINTMENT_ACTION_TYPE = {
  FETCH_APPOINTMENTS: "FETCH_APPOINTMENTS",

  CREATE_APPOINTMENT_REQUEST: "CREATE_APPOINTMENT_REQUEST",
  CREATE_APPOINTMENT_SUCCESS: "CREATE_APPOINTMENT_SUCCESS",
  CREATE_APPOINTMENT_FAILURE: "CREATE_APPOINTMENT_FAILURE",

  UPDATE_APPOINTMENT_REQUEST: "UPDATE_APPOINTMENT_REQUEST",
  UPDATE_APPOINTMENT_SUCCESS: "UPDATE_APPOINTMENT_SUCCESS",
  UPDATE_APPOINTMENT_FAILURE: "UPDATE_APPOINTMENT_FAILURE"
};

export const USER_ACTION_TYPE = {
  FETCH_REQUEST: "USER_FETCH_REQUEST",
  FETCH_SUCCESS: "USER_FETCH_SUCCESS",
  FETCH_FAILURE: "USER_FETCH_FAILURE",

  ADD_REQUEST: "USER_ADD_REQUEST",
  ADD_SUCCESS: "USER_ADD_SUCCESS",
  ADD_FAILURE: "USER_ADD_FAILURE",

  DELETE_REQUEST: "USER_DELETE_REQUEST",
  DELETE_SUCCESS: "USER_DELETE_SUCCESS",
  DELETE_FAILURE: "USER_DELETE_FAILURE",

  EDIT_REQUEST: "USER_EDIT_REQUEST",
  EDIT_SUCCESS: "USER_EDIT_SUCCESS",
  EDIT_FAILURE: "USER_EDIT_FAILURE",

  SET_FILTER: "USER_SET_FILTER",
  SET_SEARCH_TEXT: "USER_SET_SEARCH_TEXT",
  SET_SORT: "USER_SET_SORT",

  OPEN_CREATE_USER_POPUP: "USER_CREATE_OPEN_POPUP",
  OPEN_POPUP: "USER_OPEN_POPUP",
  CLOSE_POPUP: "USER_CLOSE_POPUP"
};

export const REPORT_ACTION_TYPE = {
  FETCH_PATIENTS_REQUEST: "FETCH_PATIENTS_REQUEST",
  FETCH_PATIENTS_SUCCESS: "FETCH_PATIENT_SUCCESS",
  FETCH_PATIENTS_FAILURE: "FETCH_PATIENT_FAILURE",

  SET_SEARCH_FIELD: "SET_SEARCH_FIELD",

  OPEN_POPUP: "REPORT_OPEN_POPUP",
  CLOSE_POPUP: "REPORT_CLOSE_POPUP",

  SET_INFO_FOR_POPUP: "SET_INFO_FOR_POPUP"
};
