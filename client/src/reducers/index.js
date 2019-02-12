import { combineReducers } from 'redux';
import NoteReducer from './NoteReducer';
import AuthReducer from './AuthReducer';
import CalendarReducer from './CalendarReducer';
import UserReducer from "./UserReducer";

export default combineReducers({
    note: NoteReducer,
    auth: AuthReducer,
    calendar: CalendarReducer,
    user: UserReducer
});