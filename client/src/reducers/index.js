import { combineReducers } from 'redux';
import NoteReducer from './NoteReducer';
import AuthReducer from './AuthReducer';

export default combineReducers({
    note: NoteReducer,
    auth: AuthReducer
});