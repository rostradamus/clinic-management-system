import React, { Component } from "react";
import { Label, Modal, Grid, Button, Select, Header, Input, Form, Container, Divider} from "semantic-ui-react";
import { DateInput } from 'semantic-ui-calendar-react';
import * as moment from 'moment';
import { UserAction, CreateUserAction } from 'actions';
import { STATE_CONST } from './CreateUserPopup';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './CreateUserPopup.css';

const THERAPIST_TYPE = [
  { key: 'PT', text: 'PT', value: 'PT' },
  { key: 'PT RA', text: 'PT RA', value: 'PT RA' },
  { key: 'OT', text: 'OT', value: 'OT' },
  { key: 'OT RA', text: 'OT RA', value: 'OT RA' },
  { key: 'SLP', text: 'SLP', value: 'SLP' },
  { key: 'SLPA', text: 'SLPA', value: 'SLPA' },
  { key: 'SW', text: 'SW', value: 'SW' },
  { key: 'SWA', text: 'SWA', value: 'SWA' }
];

class CreateStaffPopup extends Component{
  constructor(props) {
    super(props);
    this.initialState = {
      form: {
        therapist_type: THERAPIST_TYPE[0].value,
        first_name: '',
        last_name:'',
        email:'',
        phone_number:'',
        type: '',
        permission_level:''
      },
      error: { // erase the optional fields?
        first_name: false,
        last_name:false,
        email:false,
        therapist_type: false,
        phone_number: false
      }
    };
    moment.locale('en');
    this.state = this.initialState;
    this.handleInputChange=this.handleInputChange.bind(this);
    this.handleDateChange=this.handleDateChange.bind(this);
    this.handleSelectChange=this.handleSelectChange.bind(this);
  }

  static getDerivedStateFromProps(props, state) {

    const permission = props.typeUser === 'Staff' ? 'Medium' : 'High';
    if (props.typeUser && props.typeUser !== state.form.typeUser) {
      return {
        ...state,
        form:{
          ...state.form,
        permission_level: permission,
        type: props.typeUser
      }};
    }
    return {};
  }

  handleInputChange(event, key) {
    const value = event.target && event.target.value;
    this.setState({form: {
      ...this.state.form,
      [key]: value}, error:{
      ...this.state.error,
      [key]: false
      }});
  }

  handleDateChange(field, { value }) {
    this.setState({form:{
      ...this.state.form,
      [field]: new Date(value)}});
  }

  handleSelectChange(field, { value } ) {
    this.setState({form: {
      ...this.state.form,
      [field]: value}});
  }

  handleFinalValidation(event) {
    event.preventDefault();
    if(!this.validateForm()) return;
    this.props.getUserByEmail(this.state.form.email)
     .then(()=> {
      if(this.props.user.length === 0){
          if(this.props.typeUser === 'Administrator'){
              this.handleCreateAdmin();
            }else this.handleCreateStaff();
      }else{
       alert("Email exists")
       //TODO: error handle
      }})
     .catch(() => alert("Fatal: This should never happen"));
  }

  handleCreateStaff() {
    const {therapist_type, ... User} = this.state.form;
    const staff = Object.assign({
          Staff:{therapist_type:therapist_type},
          User});
    this.props.createStaff(staff)
      .then(() => this.props.getUsers())
      .catch(() => alert("Fatal: This should never happen"));
  }

  handleCreateAdmin() {
    const {therapist_type, ... User} = this.state.form;
    this.props.createAdmin({User})
      .then(() => this.props.getUsers())
      .catch(() => alert("Fatal: This should never happen"));
  }

  validateEmail() {
    const {email} = this.state.form;
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }

  validateForm() {
    const {email} = this.state.form;
    const errorFields={};
    Object.entries(this.state.error).map(entry => {
      if((entry[0] === 'email' && !this.validateEmail()) || this.state.form[entry[0]] === ''){
        errorFields[entry[0]] = true;
      }
    });
    this.setState({error: errorFields});
    return (!Object.keys(errorFields).length);
  }

  renderForm() {
    return(
      <Modal.Content image scrolling>
        <Form id="create-user">
          <Header>Basic Information</Header>
          {this.renderFieldHelper(['first_name', 'last_name', 'phone_number', 'email'])}

          {this.props.typeUser === 'Staff' &&
            <Container>
              <Divider/>
              <Header>Practitioner Information</Header>
              {this.renderRepeatDropDownForm(THERAPIST_TYPE, 'therapist_type')}
            </Container>
          }
        </Form>
      </Modal.Content>
    );
  }

  renderFinal() {
    return(
      <Modal.Content>
        <Container textAlign="center">
          <Header>Successfully Created!</Header>
        </Container>
      </Modal.Content>
    );
  }

   renderRepeatDropDownForm(type, field) {
    return(
      <Form.Field
        className="user-field"
        defaultValue={ THERAPIST_TYPE[0].value }
        control={ Select }
        options={ type }
        label={{ children: STATE_CONST[field], htmlFor: 'form-select-control-repeat' }}
        placeholder= { THERAPIST_TYPE[0].value }
        search
        searchInput={{ id: 'form-select-control-repeat' }}
        onChange={
        (e,data)=>this.handleSelectChange( field , data)}
      />
    );
  }

  renderDateHelper(field){
    const date = this.state.form[field] === '' ? '': moment(this.state.form[field]).format('l');
    return(
      <Form.Field className="user-field">
        <label>{STATE_CONST[field]}</label>
        <DateInput
          dateFormat="MM-DD-YYYY"
          placeholder="MM-DD-YYYY"
          value={date}
          iconPosition="left"
          onChange={ (e,data) => this.handleDateChange(field, data) }
        />
      </Form.Field>
    );
  }

  renderFieldHelper(fields){
    return(
      <Container>
        {fields.map(field=> (
          <Form.Field error={this.state.error[field]} key = {field}>
            <label>{STATE_CONST[field]}</label>
            <Input maxLength='255' placeholder={STATE_CONST[field]} onChange={e=> this.handleInputChange(e, field)}/>
            {field === 'email' && this.state.form.email !== '' && !this.validateEmail() && <Label basic color = 'red' pointing> Invalid Email </Label> }
          </Form.Field>
        ))}
      </Container>
    );
  }

  renderModalActionButton(){
    return (
      <Grid columns={2} className="modal-action">
        <Grid.Column>
        {!this.props.created &&
          <Button
            className="back-btn"
            floated="left"
            onClick={this.onPrevClick}
          >
          Back
          </Button>
        }
        </Grid.Column>
        <Grid.Column>
          <Button
            primary
            className="next-btn"
            floated="right"
            onClick={e => this.onNextClick(e)}
          >
            {this.props.created? "Done": "Create"}
          </Button>
        </Grid.Column>
      </Grid>
    );
  }

  onPrevClick = (e) => {
      this.setState(this.initialState);
      this.props.prevSlide();
  }

  onNextClick(event){
    if(this.props.created){
      this.props.onClose();
    }else{
      this.handleFinalValidation(event);
    }
  }

  onClose = (e) => {
    this.setState(this.initialState);
    this.props.onClose();
  }

  render() {
    const {open, onClose } = this.props;
    return (
       <Modal size="tiny" className="createUserPopupModal" closeIcon onClose={ this.onClose } open={ open }>
        <Modal.Header>{this.props.typeUser}</Modal.Header>
        {!this.props.created && this.renderForm()}
        {this.props.created && this.renderFinal()}
        <Modal.Actions children={this.renderModalActionButton()}/>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      createAdmin: CreateUserAction.createAdmin,
      createStaff: CreateUserAction.createStaff,
      getUsers: UserAction.getUsers,
      getUserByEmail: CreateUserAction.getUserByEmail,
      prevSlide: CreateUserAction.prevSlide
    },
    dispatch
  );
}

const mapStateToProps = state => (
  { typeUser: state.createUser.typeUser,
    user: state.createUser.user,
    created: state.createUser.created});

export default connect(mapStateToProps, mapDispatchToProps)(CreateStaffPopup);