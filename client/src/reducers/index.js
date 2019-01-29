import { combineReducers } from 'redux';
import NoteReducer from 'reducers/NoteReducer';

export default combineReducers({
    note: NoteReducer
});