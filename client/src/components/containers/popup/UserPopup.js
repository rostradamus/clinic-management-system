import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { UserAction } from "actions";
import { Confirm, Modal, Button, Form, Label } from "semantic-ui-react";
import "./UserPopup.css";

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

 const CONFIRM_CONTENT = {
  Staff: "Are you sure you want to delete this staff?",
  Administrator: "Are you sure you want to delete this administrator?",
  Patient: "Are you sure you want to discharge this patient?"}

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
    const {user, error} = this.state;
    if(name === 'cPassword') {
      this.setState({user:{...this.state.user, [name]: value}});
    }else this.setState({user:{...this.state.user, [name]: value},error:{...this.state.error, [name]: false}});
    }

  _saveUser() {
    const {user} = this.state;
    if (!this._validateFields())
      return;

    const {cPassword,...form} = user;
    if(user.password === ""){
      delete form["password"];
    }
    this.props.dispatch(UserAction.editUser(form))
      .then(this._closePopup)
      .catch(() => alert("Fatal: This should never happen"));
  }

  _deleteUser(data) {
    let deleteAction;
    const {user} = this.state;
    const {type} = this.state.user;
    if (type ==='Patient') {
      deleteAction = this.props.dispatch(UserAction.dischargePatient(user))
    } else if (type === 'Administrator') {
      deleteAction = this.props.dispatch(UserAction.deleteAdmin(user));
    } else {
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
    if(!this._validatePhoneNum()) errorFields['phone_number'] = true;
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

  _validatePhoneNum() {
    const {phone_number} = this.state.user;
    const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
    return phone_number === "" || regex.test(String(phone_number));
  }

  _validatePassword() {
    const { password, cPassword } = this.state.user;
    return ((password === cPassword) || (typeof password === 'undefined' && cPassword === "") || (password === "" && typeof cPassword === 'undefined'));
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
        className="userPopupModal"
        size="small"
        open={ this.props.user && true }
        onClose={ this._closePopup } closeIcon>
        <Modal.Header >User Profile</Modal.Header>
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
              {!this._validateEmail() && <Label basic color = 'red' pointing> Invalid Phone Number </Label> }
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
            {!this._validatePhoneNum() && <Label basic color = 'red' pointing> Invalid Phone Number </Label> }
          </Form>

        </Modal.Content>
          <Modal.Actions>
            {!(this.props.user && this.props.user.id === this.props.current_user.id) &&
              <Button negative onClick={this._deleteOpen}>{type === 'Patient' ?  'Discharge' : 'Delete'}</Button>}
              <Confirm id="userPopup_confirm"
                confirmButton={type === 'Patient' ?  'Discharge' : 'Delete'}
                open={this.state.deleteOpen}
                onCancel={this._deleteOpen}
                content ={CONFIRM_CONTENT[type]}
                onConfirm={() => this._deleteUser(this.state) }/>
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
