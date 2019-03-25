import React, { Component } from "react";
import { connect } from "react-redux";
import { UserAction } from "actions";
import { Confirm, Grid, Modal, Button, Icon, Form } from "semantic-ui-react";

class UserPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteOpen: false,
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      type: "",
      permission_level: ""
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.user && props.user.id!== state.id) {
      return {
        ...props.user
      };
    }
    return {};
  }

  _renderDeleteButton() {
    const isOwnUser = this.props.user && this.props.user.id === this.props.current_user.id;
    if (isOwnUser) 
      return (<Grid.Column />);
    return (
      <Grid.Column>
        <Button floated="left"onClick={this._deleteOpen}><Icon name="delete"/>Delete</Button>
        <Confirm open={this.state.deleteOpen} onCancel={this._deleteOpen} onConfirm={() => this._deleteUser(this.state) }/>
      </Grid.Column>
    );
  }

   _handleInputChange(e, {name, value}) {
    this.setState({[name]: value});
  }

  _saveUser() {
    const {deleteOpen, ...user} = this.state
    this.props.dispatch(UserAction.editUser(user))
      .then(() => this.props.dispatch(UserAction.closeUserPopup()))
      .catch(() => alert("Fatal: This should never happen"));

  }

  _deleteUser(data) {
    var deleteAction;
    const {deleteOpen, ...user} = this.state;
    const {type} = this.state;
    if(type ==='Patient'){
      deleteAction = this.props.dispatch(UserAction.deletePatient(user))
    }else if (type === 'Admin') {
      deleteAction = this.props.dispatch(UserAction.deleteAdmin(user));
    }else {
      deleteAction = this.props.dispatch(UserAction.deleteStaff(user));
    }
    deleteAction
     // .then(() => this.props.dispatch(UserAction.getUsers()))
      .then(() => this.props.dispatch(UserAction.closeUserPopup()))
      .catch(() => alert("Fatal: This should never happen"));
  }

  _deleteOpen = () => {
    const {deleteOpen} = this.state;
    this.setState({ deleteOpen: !deleteOpen })
  }

  _deleteUser(data) {
    var deleteAction;
    const {deleteOpen, ...user} = this.state;
    const {type} = this.state;
    console.log(type);
    if(type ==='Patient'){
      deleteAction = this.props.dispatch(UserAction.deletePatient(user))
    }else if (type === 'Admin') {
      deleteAction = this.props.dispatch(UserAction.deleteAdmin(user));
    }else {
      deleteAction = this.props.dispatch(UserAction.deleteUser(user));
    }
    deleteAction
      .then(() => this.props.dispatch(UserAction.closeUserPopup()))
      .catch(() => alert("Fatal: This should never happen"));
  }

  _deleteOpen = () => {
    const {deleteOpen} = this.state;
    this.setState({ deleteOpen: !deleteOpen })
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
            <Grid columns={2} className="modal-action">
            { this._renderDeleteButton() }
            <Grid.Column>
              <Button
              positive
              onClick={ () => this._saveUser() }>
              <Icon name="save" />
              Save
            </Button>
            </Grid.Column>
          </Grid>

        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({ user: state.user.popupUser, current_user: state.auth.current_user });

export default connect(mapStateToProps)(UserPopup);
