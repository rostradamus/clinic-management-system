import { combineReducers } from 'redux';
import NoteReducer from './NoteReducer';
import AuthReducer from './AuthReducer';
import CalendarReducer from './CalendarReducer';

export default combineReducers({
    note: NoteReducer,
    auth: AuthReducer,
    calendar: CalendarReducer
});