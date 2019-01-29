import React, { Component } from 'react';
import { connect } from 'react-redux';
import NoteAction from "actions/NoteAction";

class NoteDetail extends Component {
  componentDidMount() {
    this.props.dispatch(NoteAction.getNote(this.props.match.params.id));
  }

  render() {
    return (
      <div>
        <h3> {this.props.note.selected.title}</h3>
        <p> {this.props.note.selected.created_at}</p>
        <br/>
        <p> {this.props.note.selected.content}</p>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  note: state.note
});

export default connect(mapStateToProps)(NoteDetail);