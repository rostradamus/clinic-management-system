import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { UserAction } from "actions";
import { Confirm, Modal, Button, Icon, Form, Label, Container} from "semantic-ui-react";

const INITIAL_STATE = {
  deleteOpen: false,
  user: {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    cPassword: "",
    phone_number: "",
    type: "",
  },
  error: {}
};

class UserPopup extends Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.user && props.user.id !== state.user.id) {
      return {
        user: Object.assign({...state.user}, props.user)
      };
    }
    return {};
  }

  _handleInputChange(e, {name, value}) {
    const user = Object.assign({...this.state.user}, {[name]: value});
    this.setState({user});
  }

  _saveUser() {
    const {user} = this.state;
    if (!this._validatePassword())
      return;
    delete user["cPassword"];
    if (user.password === ""){
      delete user["password"];
    }
    this.props.dispatch(UserAction.editUser(user))
      .then(this._closePopup)
      .catch(() => alert("Fatal: This should never happen"));
  }

  _deleteUser(data) {
    var deleteAction;
    const {user} = this.state;
    const {type} = this.state.user;
    if(type ==='Patient'){
   //   deleteAction = this.props.dispatch(UserAction.deletePatient(user))
    }else if (type === 'Administrator') {
      deleteAction = this.props.dispatch(UserAction.deleteAdmin(user));
    }else {
      deleteAction = this.props.dispatch(UserAction.deleteStaff(user));
    }
    deleteAction
      .then(this._closePopup)
      .catch(() => alert("Fatal: This should never happen"));
  }

  _validatePassword() {
    const { password, cPassword } = this.state.user;
    // Password and Confirm Password match
    if (password !== cPassword) {
      this.setState({
        error: {
          field: "password",
          message: "Password does NOT match."
        }
      });
      return false;
    }
    // Empty password field
    if (password === "") {
      return true;
    }
    // TODO: Validate password more firmly
    return true;
  }

  _handleInputError(field) {
    if (isEmpty(this.state.error) || field !== this.state.error.field)
      return null;
    return (
      <Label basic color='red' pointing>
        { this.state.error.message }
      </Label>
    );
  }

  _closePopup = () => {
    this.setState(INITIAL_STATE);
    this.props.dispatch(UserAction.closeUserPopup())
  };

  _deleteOpen = () => {
    const {deleteOpen} = this.state;
    this.setState({ deleteOpen: !deleteOpen })
  };

  render() {
    const { first_name, last_name, email, password, cPassword,
      phone_number, type  } = this.state.user;
    return (
      <Modal
        size="small"
        open={ this.props.user && true }
        onClose={ this._closePopup }>
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
            <Form.Group widths="equal">
            <Form.Input fluid
              type="password"
              label="New Password"
              name="password"
              autoComplete="new-password"
              value={ password }
              onChange={ this._handleInputChange.bind(this) } />
            <Form.Field>
            <Form.Input fluid
              type="password"
              label="Confirm New Password"
              name="cPassword"
              value={ cPassword }
              onChange={ this._handleInputChange.bind(this) } />
            </Form.Field>
            </Form.Group>
            { this._handleInputError("password") }
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
            </Form.Group>
          </Form>

        </Modal.Content>
          <Modal.Actions>
            {!(this.props.user && this.props.user.id === this.props.current_user.id) &&
              <Button onClick={this._deleteOpen}>{this.state.user.type === 'Patient' ?  'Discharge' : 'Delete'}</Button>}
              <Confirm open={this.state.deleteOpen} onCancel={this._deleteOpen} onConfirm={() => this._deleteUser(this.state) }/>
              <Button
              primary
              onClick={ () => this._saveUser() }>
              Save
            </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({ user: state.user.popupUser, current_user: state.auth.current_user });

export default connect(mapStateToProps)(UserPopup);
