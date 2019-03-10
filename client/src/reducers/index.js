import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import CalendarReducer from "./CalendarReducer";
import UserReducer from "./UserReducer";
import ReportReducer from "./ReportReducer";

export default combineReducers({
	auth: AuthReducer,
	calendar: CalendarReducer,
	user: UserReducer,
	report: ReportReducer
});
