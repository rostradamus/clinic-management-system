import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import NoteAction from "actions/NoteAction";

class NoteList extends Component {
  componentDidMount() {
    this.props.dispatch(NoteAction.getNotes());
  }


  _renderItem(item) {
    return (
      <li key={item.note_id}>
        <Link to={ `/note/${item.note_id}` }>{item.title}</Link>
      </li>
    );
  }

  render() {
    return (
      <div>
        <h2> Note List </h2>
        <ul>
          { this.props.note.items.map(this._renderItem.bind(this)) }
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  note: state.note
});

/* Another option to dispatch action if there are multiple actions required
const mapDispatchToProps = dispatch => ({
  getNotes: async () => {
    dispatch(NoteAction.getNotes());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteList);
*/

export default connect(mapStateToProps)(NoteList);