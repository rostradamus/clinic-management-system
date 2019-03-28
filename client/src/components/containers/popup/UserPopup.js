import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { UserAction } from "actions";
import { Confirm, Modal, Button, Icon, Form, Label, Container} from "semantic-ui-react";

const INITIAL_STATE = {
  open: false,
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
  error: {
    first_name:false,
    last_name: false,
    phone_number: false,
    email:false,
    password:false
  }
};

class UserPopup extends Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.user && !state.open) {
       return {
        ...state,
        open: true,
        user: props.user
       };
     }return {};
   }

  _handleInputChange(e, {name, value}) {
    this.setState({user:{...this.state.user, [name]: value},error:{...this.state.error, [name]: false}});
    }

  _saveUser() {
    const {user} = this.state;
    if (!this._validateFields())
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
      deleteAction = this.props.dispatch(UserAction.deletePatient(user))
    }else if (type === 'Administrator') {
      deleteAction = this.props.dispatch(UserAction.deleteAdmin(user));
    }else {
      deleteAction = this.props.dispatch(UserAction.deleteStaff(user));
    }
    deleteAction
      .then(this._closePopup)
      .catch(() => alert("Fatal: This should never happen"));
  }

  _validateFields(){
    const errorFields={};
    const{ error } = this.state;
    const {password, email, ... fields} = error;
    Object.entries(fields).map(entry => {
      if(this.state.user[entry[0]] === ''){
        errorFields[entry[0]] = true;
      }
    });
    if(!this._validateEmail()) errorFields['email'] = true;
    if(!this._validatePassword()) errorFields['password'] = true;
    this.setState({error: errorFields});
    return (!Object.keys(errorFields).length);
  }

  _validateEmail() {
    const {user} = this.state;
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const valid = regex.test(String(user.email).toLowerCase());
    return user.type === 'Patient' ? (user.email === '' || valid) : valid;
  }

  _validatePassword() {
    const { password, cPassword } = this.state.user;
    if (password !== cPassword)
      return false;
    if (password === "") {
      return true;
    }
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
    this.props.dispatch(UserAction.closeUserPopup());
    this.setState(INITIAL_STATE);
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
              <Form.Input fluid error={this.state.error.first_name}
                label="First Name"
                name="first_name"
                value={ first_name }
                onChange={ this._handleInputChange.bind(this) } />
              <Form.Input fluid error={this.state.error.last_name}
                label="Last Name"
                name="last_name"
                value={ last_name }
                onChange={ this._handleInputChange.bind(this) } />
            </Form.Group>
            <Form.Input fluid error={this.state.error.email}
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
              value={ password ? password : '' }
              onChange={ this._handleInputChange.bind(this) } />
            <Form.Field>
            <Form.Input fluid
              type="password"
              label="Confirm New Password"
              name="cPassword"
              value={ cPassword ? cPassword : '' }
              onChange={ this._handleInputChange.bind(this) } />
            </Form.Field>
            </Form.Group>
            {!this._validatePassword() && <Label basic color='red' pointing> Passwords do not match </Label>}
            <Form.Group widths="equal">
            <Form.Input fluid error={this.state.error.phone_number}
              label="Phone Number"
              name="phone_number"
              value={ phone_number }
              onChange={ this._handleInputChange.bind(this) } />
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
              <Button onClick={this._deleteOpen}><Icon name="delete"/>Delete</Button>}
              <Confirm open={this.state.deleteOpen} onCancel={this._deleteOpen} onConfirm={() => this._deleteUser(this.state) }/>
              <Button
              primary
              onClick={ () => this._saveUser() }>
              <Icon name="save" />
              Save
            </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({ user: state.user.popupUser, current_user: state.auth.current_user });

export default connect(mapStateToProps)(UserPopup);
