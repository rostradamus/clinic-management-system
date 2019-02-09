import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { Header, List } from "semantic-ui-react";
import NoteAction from "actions/NoteAction";

class NoteList extends Component {
  componentDidMount() {
    this.props.dispatch(NoteAction.getNotes());
  }


  _renderItem(item) {
    return (
      <List.Item key={item.note_id}>
        <List.Content as={Link} to={ `/note/${item.note_id}` } content={item.title} />
      </List.Item>
    );
  }

  render() {
    return (
      <div>
        <Header size="medium"> Note List </Header>
        <List>
          { this.props.note.items.map(this._renderItem.bind(this)) }
        </List>
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