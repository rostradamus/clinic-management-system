import React, { Component } from "react";
import { connect } from "react-redux";
import { UserAction } from "actions";
import { Modal, Button, Icon, Form } from "semantic-ui-react";

class UserPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      type: "",
      permission_level: ""
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.user && props.user.id !== state.id) {
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
    const { first_name, last_name, email,
      phone_number, type, permission_level } = this.state;

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
                label="First Name"
                name="first_name"
                value={ first_name }
                onChange={ this._handleInputChange.bind(this) } />
              <Form.Input fluid
                label="Last Name"
                name="last_name"
                value={ last_name }
                onChange={ this._handleInputChange.bind(this) } />
            </Form.Group>
            <Form.Input fluid
              label="Email"
              name="email"
              value={ email }
              onChange={ this._handleInputChange.bind(this) } />
            <Form.Input fluid
              label="Phone Number"
              name="phone_number"
              value={ phone_number }
              onChange={ this._handleInputChange.bind(this) } />
            <Form.Group widths="equal">
              <Form.Input fluid readOnly
                label="Type"
                name="type"
                placeholder={ type }
                onChange={ this._handleInputChange.bind(this) } />
              <Form.Input fluid readOnly
                label="Permission"
                name="permission_level"
                placeholder={ permission_level }
                onChange={ this._handleInputChange.bind(this) } />
            </Form.Group>
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
