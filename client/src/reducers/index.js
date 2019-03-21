import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import CalendarReducer from "./CalendarReducer";
import UserReducer from "./UserReducer";
import ReportReducer from "./ReportReducer";
import PatientReducer from "./PatientReducer";
import PatientStaffSearchReducer from "./PatientStaffSearchReducer";

export default combineReducers({
  auth: AuthReducer,
  calendar: CalendarReducer,
  user: UserReducer,
  report: ReportReducer,
  patient: PatientReducer,
  patientStaffSearch: PatientStaffSearchReducer
});
