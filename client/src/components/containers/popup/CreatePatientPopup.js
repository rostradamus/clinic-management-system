import React, { Component } from "react";
import { Modal, Grid, Button, Select, Header, Input, Form, Container, Divider} from "semantic-ui-react";
import { DateInput } from 'semantic-ui-calendar-react';
import * as moment from 'moment';
import { STATE_CONST } from './CreateUserPopup';
import './CreateUserPopup.css';

const PATIENT_CAT = [
  { key: '1', text: '1', value: '1' },
  { key: '2', text: '2', value: '2' },
  { key: '3', text: '3', value: '3' }
];

export default class CreatePatientPopup extends Component{
  constructor(props) {
    super(props);
    moment.locale('en');

    this.state = {
      slideIndex: 1,
      userName:'',
      password:'',
      firstName: '',
      lastName:'',
      email:'',
      phoneNum:'',
      birthDate:'',
      address:'',
      notes:'',
      emergencyContactName:'',
      emergencyContactPhoneNum:'',
      mrn:'',
      typeofInjury:'',
      patientType:'',
      admissionDate:'',
      dischargeDate:'',
      patientProgram:'',
      patientCategory:'',
      permissionLevel:''
    };
    this.handleInputChange=this.handleInputChange.bind(this);
    this.handleDateChange=this.handleDateChange.bind(this);
    this.handleSelectChange=this.handleSelectChange.bind(this);
    this.handleCreate=this.handleCreate.bind(this);

  }

  handleInputChange(event, key) {
    const value = event.target && event.target.value;
    this.setState({[key]: value});
  }

  handleDateChange(field, { value }) {
    this.setState({ [field] : new Date(value) });
  }

  handleCreate(event){
    // leaving commented out code just in case.
    // const copiedState = Object.assign({...this.state});
    // this.props.createPatient(copiedState);
    // this.props.onNextClick();
    this.setState({isCreated:true});
  }


  handleSelectChange(field, { value }) {
    this.setState({[field]: value});
  }

  renderForm() {
    return(
      <Modal.Content image scrolling>
        <Form id="create-user">
          <Header>Basic Information</Header>

          {this.renderFieldHelper(['userName', 'password', 'firstName', 'lastName'])}
          {this.renderDateHelper('birthDate')}
          {this.renderFieldHelper(['phoneNum', 'email', 'address'])}

          <Divider/>
          <Header>Emergency Contacts</Header>
          {this.renderFieldHelper(['emergencyContactName', 'emergencyContactPhoneNum'])}
          <Divider/>
          <Header>Patient Information</Header>

          <Form.Group inline>
            <Form.Radio
              label='In Patient'
              value='in'
              checked={this.state.patientType === 'in'}
              onChange={
                (e,data)=>this.handleSelectChange('patientType', data)}
            />
            <Form.Radio
              label='Out Patient'
              value='out'
              checked={this.state.patientType === 'out'}
              onChange={
                (e,data)=>this.handleSelectChange('patientType', data)}
            />
          </Form.Group>

          {this.renderDateHelper('admissionDate')}
          {this.renderDateHelper('dischargeDate')}

          {this.renderFieldHelper(['mrn', 'typeofInjury', 'patientProgram'])}
          {this.renderRepeatDropDownForm()}

          <Divider/>
          {this.renderNoteForm()}
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

  renderNoteForm() {
    return(
      <Form.TextArea label='Note' placeholder="Add Note"
        onChange={e => this.handleInputChange(e, "notes") }
      />
    );
  }

  renderDateHelper(field){
    const date = this.state[field] === '' ? '': moment(this.state[field]).format('l');
    return(
      <Form.Field className="user-field">
        <label>{STATE_CONST[field]}</label>
        <DateInput
        dateFormat="MM-DD-YYYY"
        placeholder="MM-DD-YYYY"
        value={date}
        iconPosition="left"
        onChange={
          (e,data) => this.handleDateChange(field, data)
        }
        />
      </Form.Field>
    );
  }

  renderFieldHelper(fields){
    return(
      <Container>
      {fields.map(field=>(
        <Form.Field key = {field}>
        <label>{STATE_CONST[field]}</label>
        <Input placeholder={STATE_CONST[field]} onChange={e=> this.handleInputChange(e, field)}/>
        </Form.Field>
        ))}
      </Container>
      );
  }

  renderRepeatDropDownForm() {
    return(
      <Form.Field
        className="user-field"
        control={ Select }
        options={ PATIENT_CAT }
        label={{ children: 'Patient Category', htmlFor: 'form-select-control-repeat' }}
        placeholder="1"
        search
        searchInput={{ id: 'form-select-control-repeat' }}
        onChange={
        (e,data)=>this.handleSelectChange('patientCategory', data)}
      />
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
            Back</Button>}
        </Grid.Column>
        <Grid.Column>
          <Button
            primary
            className="next-btn"
            floated="right"
            onClick={e => this.onNextClick()}>
              {this.state.isCreated? "Done": "Create"}
          </Button>
        </Grid.Column>
      </Grid>
    );
  }

  onNextClick(){
    if(this.state.isCreated){
      this.props.onClose();
    }else{
      this.handleCreate();
    }
  }


  render() {
    const {isCreated} = this.state;
      return (
        <React.Fragment>
          {!isCreated && this.renderForm()}
          {isCreated&& this.renderFinal()}
          <Modal.Actions children={this.renderModalActionButton()}/>
        </React.Fragment>
      )
    }

}


