import { combineReducers } from "redux";
import { AUTH_ACTION_TYPE } from "actions/ActionTypes";
import AuthReducer from "./AuthReducer";
import CalendarReducer from "./CalendarReducer";
import UserReducer from "./UserReducer";
import ReportReducer from "./ReportReducer";
import CreateUserReducer from "./CreateUserReducer";
import PatientStaffSearchReducer from "./PatientStaffSearchReducer";

// export default combineReducers({
//   auth: AuthReducer,
//   calendar: CalendarReducer,
//   user: UserReducer,
//   report: ReportReducer,
//   createUser: CreateUserReducer,
//   patientStaffSearch: PatientStaffSearchReducer
// });

const appReducer = combineReducers({
  auth: AuthReducer,
  calendar: CalendarReducer,
  user: UserReducer,
  report: ReportReducer,
  createUser: CreateUserReducer,
  patientStaffSearch: PatientStaffSearchReducer
});

export default (state, action) => {
  if (action.type === AUTH_ACTION_TYPE.LOGOUT_SUCCESS ) {
    state = undefined;
  }

  return appReducer(state, action)
}