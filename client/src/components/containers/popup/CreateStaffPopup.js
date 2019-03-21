import React, { Component } from "react";
import { Modal, Grid, Button, Select, Header, Input, Form, Container, Divider} from "semantic-ui-react";
import { DateInput } from 'semantic-ui-calendar-react';
import * as moment from 'moment';
import { UserAction } from 'actions';
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
    moment.locale('en');

    this.state = {
      isCreated:false,
      therapisty_type: THERAPIST_TYPE[0],
      form: {
        first_name: '',
        last_name:'',
        email:'',
        phone_number:'',
        permission_level:''
      },
      error: { // erase the optional fields?
        first_name: false,
        last_name:false,
        email:false,
        therapisty_type: false,
        phone_number: false
      }
    };
    this.handleInputChange=this.handleInputChange.bind(this);
    this.handleDateChange=this.handleDateChange.bind(this);
    this.handleSelectChange=this.handleSelectChange.bind(this);
    this.handleCreate=this.handleCreate.bind(this);
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

  handleSelectChange(field, { value }) {
    this.setState({[field]: value});
  }

 handleCreate(event){
    event.preventDefault();
    if(this.validateForm()){
      if(this.props.isStaff){
        const user = Object.assign({
          staff:{therapisty_type:this.state.therapisty_type},
          user:{...this.state.form}
      });
        this.props.createUser(user);
      }else{
        const user= Object.assign({
        user:{...this.state.form}});
        this.props.createUser(user);
      }
      this.setState({isCreated:true});
    }
  }

  validateForm() {
    const errorFields={};
    Object.entries(this.state.error).map(entry => {
      if(this.state.form[entry[0]]==='' ){
        errorFields[entry[0]]=true;
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

          {this.props.isStaff &&
            <Container>
              <Divider/>
              <Header>Practitioner Information</Header>
              {this.renderRepeatDropDownForm()}
            </Container>
          }

          <Divider/>
          <Header>Permission Level</Header>

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

   renderRepeatDropDownForm() {
    return(
      <Form.Field
        className="user-field"
        defaultValue={'PT'}
        control={ Select }
        options={ THERAPIST_TYPE }
        label={{ children: 'Therapist Type', htmlFor: 'form-select-control-repeat' }}
        placeholder="PT"
        search
        searchInput={{ id: 'form-select-control-repeat' }}
        onChange={
        (e,data)=>this.handleSelectChange('therapisty_type', data)}
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
            <Input placeholder={STATE_CONST[field]} onChange={e=> this.handleInputChange(e, field)}/>
          </Form.Field>
        ))}
      </Container>
    );
  }

  renderModalActionButton(){
    return (
      <Grid columns={2} className="modal-action">
        <Grid.Column>
        {!this.state.isCreated &&
          <Button
            className="back-btn"
            floated="left"
            onClick={e => this.props.onPrev()}
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
            {this.state.isCreated? "Done": "Create"}
          </Button>
        </Grid.Column>
      </Grid>
    );
  }

  onNextClick(event){
    if(this.state.isCreated){
      this.props.onClose();
    }else{
      this.handleCreate(event);
    }
  }

  render() {
    return (
      <React.Fragment>
        {!this.state.isCreated && this.renderForm()}
        {this.state.isCreated&& this.renderFinal()}
        <Modal.Actions children={this.renderModalActionButton()}/>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      createUser: UserAction.addUser,
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(CreateStaffPopup);