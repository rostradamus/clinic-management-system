import React, { Component } from "react";
import { connect } from "react-redux";
import { UserAction } from "actions";
import { Modal, Button, Icon, Form } from "semantic-ui-react";

const mockRoles = [
  { key: "headPractitioner", text: "Head Practitioner", value: "Head Practitioner" },
  { key: "practitioner", text: "Staff", value: "Staff" },
  { key: "mentalTherapist", text: "Mental Therapist", value: "Mental Therapist" }
];

class UserPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      type: "",
      role: ""
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.user && props.user.userId !== state.userId) {
      return {
        ...props.user
      };
    }
    return {};
  }

  _handleInputChange(e, {name, value}) {
    this.setState({[name]: value});
  }

  _saveUser(data) {
    this.props.dispatch(UserAction.editUser(data))
      .then(() => this.props.dispatch(UserAction.closeUserPopup()))
      // TODO: [REMOVE] SHOULD REPLACE THIS WITH BETTER SOLUTION
      .catch(() => alert("Fatal: This should never happen"));
  }

  render() {
    const { name, email, type, role } = this.state;

    return (
      <Modal
        size="small"
        open={ this.props.user && true }
        onClose={ () => this.props.dispatch(UserAction.closeUserPopup()) }>
        <Modal.Header>User Profile</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths="equal">
              <Form.Input fluid
                label="Name"
                name="name"
                value={ name }
                onChange={ this._handleInputChange.bind(this) } />
              <Form.Input fluid
                label="Email"
                name="email"
                value={ email }
                onChange={ this._handleInputChange.bind(this) } />
            </Form.Group>
            <Form.Input fluid readOnly
                label="Type"
                name="type"
                placeholder={ type }
                onChange={ this._handleInputChange.bind(this) } />
            <Form.Select fluid
              label="Role"
              options={ mockRoles }
              name="role"
              selected={ role }
              placeholder={ role }
              onChange={ this._handleInputChange.bind(this) } />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button positive
            onClick={ () => this._saveUser(this.state) }>
            <Icon name="save" />
            Save
          </Button>
          <Button
            onClick={ () => this.props.dispatch(UserAction.closeUserPopup()) }>
            <Icon name="close" />
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({ user: state.user.popupUser });

export default connect(mapStateToProps)(UserPopup)
