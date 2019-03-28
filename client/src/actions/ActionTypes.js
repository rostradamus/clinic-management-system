export const AUTH_ACTION_TYPE = {
  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT_REQUEST: "LOGOUT_REQUEST",
  LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
  LOGOUT_FAILURE: "LOGOUT_FAILURE"
};

export const APPOINTMENT_ACTION_TYPE = {
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_FAILURE: "FETCH_FAILURE",

  CREATE_SUCCESS: "CREATE_SUCCESS",
  CREATE_FAILURE: "CREATE_FAILURE",

  UPDATE_SUCCESS: "UPDATE_SUCCESS",
  UPDATE_FAILURE: "UPDATE_FAILURE",

  DELETE_SUCCESS: "DELETE_SUCCESS",
  DELETE_FAILURE: "DELETE_FAILURE",

  ERROR_MESSAGE_RESET: "ERROR_MESSAGE_RESET"
};

export const PATIENT_STAFF_SEARCH_ACTION_TYPE = {
  FETCH_REQUEST: "PATIENT_STAFF_SEARCH_REQUEST",
  FETCH_SUCCESS: "PATIENT_STAFF_SEARCH_SUCCESS",
  FETCH_FAILURE: "PATIENT_STAFF_SEARCH_FAILURE"
}

export const USER_ACTION_TYPE = {
  FETCH_REQUEST: "USER_FETCH_REQUEST",
  FETCH_SUCCESS: "USER_FETCH_SUCCESS",
  FETCH_FAILURE: "USER_FETCH_FAILURE",

  FETCH_DISCHARGED_PATIENTS_REQUEST: "FETCH_DISCHARGED_PATIENTS_REQUEST",
  FETCH_DISCHARGED_PATIENTS_SUCCESS: "FETCH_DISCHARGED_PATIENTS_SUCCESS",
  FETCH_DISCHARGED_PATIENTS_FAILURE: "FETCH_DISCHARGED_PATIENTS_FAILURE",

  ADD_REQUEST: "USER_ADD_REQUEST",
  ADD_SUCCESS: "USER_ADD_SUCCESS",
  ADD_FAILURE: "USER_ADD_FAILURE",

  DELETE_REQUEST: "USER_DELETE_REQUEST",
  DELETE_SUCCESS: "USER_DELETE_SUCCESS",
  DELETE_FAILURE: "USER_DELETE_FAILURE",

  EDIT_REQUEST: "USER_EDIT_REQUEST",
  EDIT_SUCCESS: "USER_EDIT_SUCCESS",
  EDIT_FAILURE: "USER_EDIT_FAILURE",

  PATIENT_DELETE_REQUEST: "PATIENT_DELETE_REQUEST",
  PATIENT_DELETE_SUCCESS: "PATIENT_DELETE_SUCCESS",
  PATIENT_DELETE_FAILURE: "PATIENT_DELETE_FAILURE",

  ADMIN_DELETE_REQUEST: "ADMIN_DELETE_REQUEST",
  ADMIN_DELETE_SUCCESS: "ADMIN_DELETE_SUCCESS",
  ADMIN_DELETE_FAILURE: "ADMIN_DELETE_FAILURE",

  STAFF_DELETE_REQUEST:"STAFF_DELETE_REQUEST",
  STAFF_DELETE_SUCCESS:"STAFF_DELETE_SUCCESS",
  STAFF_DELETE_FAILURE: "STAFF_DELETE_FAILURE",

  SET_FILTER: "USER_SET_FILTER",
  SET_SEARCH_TEXT: "USER_SET_SEARCH_TEXT",
  SET_SORT: "USER_SET_SORT",

  OPEN_CREATE_USER_POPUP: "USER_CREATE_OPEN_POPUP",
  OPEN_DISCHARGED_POPUP: "USER_OPEN_DISCHARGED_POPUP",
  CLOSE_DISCHARGED_POPUP: "USER_CLOSE_DISCHARGED_POPUP",
  OPEN_POPUP: "USER_OPEN_POPUP",
  CLOSE_POPUP: "USER_CLOSE_POPUP"
};

export const REPORT_ACTION_TYPE = {
  FETCH_PATIENTS_SUCCESS: "FETCH_PATIENTS_SUCCESS",
  FETCH_PATIENTS_FAILURE: "FETCH_PATIENTS_FAILURE",

  FETCH_AGGREGATE_SUCCESS: "FETCH_AGGREGATE_SUCCESS",
  FETCH_AGGREGATE_FAILURE: "FETCH_AGGREGATE_FAILURE",

  SET_SEARCH_FIELD: "SET_SEARCH_FIELD",

  OPEN_POPUP: "REPORT_OPEN_POPUP",
  CLOSE_POPUP: "REPORT_CLOSE_POPUP",

  SET_SEARCH_TEXT: "SET_SEARCH_TEXT",
};

export const CREATE_USER_ACTION_TYPE = {
  FETCH_MRN_REQUEST: "FETCH_MRN_REQUEST",
  FETCH_MRN_SUCCESS: "FETCH_MRN_SUCCESS",
  FETCH_MRN_FAILURE: "FETCH_MRN_FAILURE",

  EMAIL_FETCH_REQUEST:"EMAIL_FETCH_REQUEST",
  EMAIL_FETCH_SUCCESS: "EMAIL_FETCH_SUCCESS",
  EMAIL_FETCH_FAILURE:"EMAIL_FETCH_FAILURE",

  CREATE_ADMISSION_RECORD_SUCCESS: "CREATE_ADMISSION_RECORD_SUCCESS",
  CREATE_ADMISSION_RECORD_FAILURE: 'CREATE_ADMISSION_RECORD_FAILURE',

  PATIENT_CREATE_REQUEST: "PATIENT_CREATE_REQUEST",
  PATIENT_CREATE_SUCCESS: "PATIENT_CREATE_SUCCESS",
  PATIENT_CREATE_FAILURE: "PATIENT_CREATE_FAILURE",

  ADMIN_CREATE_REQUEST: "ADMIN_CREATE_REQUEST",
  ADMIN_CREATE_SUCCESS: "ADMIN_CREATE_SUCCESS",
  ADMIN_CREATE_FAILURE: "ADMIN_CREATE_FAILURE",

  STAFF_CREATE_REQUEST: "STAFF_CREATE_REQUEST",
  STAFF_CREATE_SUCCESS: "STAFF_CREATE_SUCCESS",
  STAFF_CREATE_FAILURE: "STAFF_CREATE_FAILURE",

  PREV_SLIDE: "PREV_SLIDE",
  NEXT_SLIDE: "NEXT_SLIDE",
  CLOSE_POPUP: "CLOSE_POPUP",
  OPEN_POPUP: "OPEN_POPUP",
  SELECT_USER:"SELECT_USER"
};
