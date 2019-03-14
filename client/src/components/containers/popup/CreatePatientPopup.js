import React, { Component } from "react";
import { Modal, Grid, Button, Select, Header, Input, Form, Container, Divider} from "semantic-ui-react";
import { DateInput } from 'semantic-ui-calendar-react';
import * as moment from 'moment';
import { UserAction } from 'actions';
//import { PatientAction } from 'actions';
import { STATE_CONST } from './CreateUserPopup';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './CreateUserPopup.css';

const PATIENT_CAT = [
  { key: '1', text: '1', value: '1' },
  { key: '2', text: '2', value: '2' },
  { key: '3', text: '3', value: '3' }
];

class CreatePatientPopup extends Component{
  constructor(props) {
    super(props);
    moment.locale('en');

    this.state = {
      slideIndex:1,
      exists: false,
      form: {
            //userName:'',
            //password:'',
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
            //patientProgram:'',  // erase?
            patientCategory:'',
            permissionLevel:''},
      error: {
            //userName:false,
            // password:false,
            firstName: false,
            lastName:false,
            email:false,
            phoneNum:false,
            birthDate:false,
            address:false,
            notes:false,
            emergencyContactName:false,
            emergencyContactPhoneNum:false,
            mrn:false,
            typeofInjury:false,
            patientType:false,
            admissionDate:false,
            dischargeDate:false,
            patientProgram:false,
            patientCategory:false,
            permissionLevel:false
      }
    };
    this.handleInputChange=this.handleInputChange.bind(this);
    this.handleDateChange=this.handleDateChange.bind(this);
    this.handleSelectChange=this.handleSelectChange.bind(this);
    this.validateField=this.validateField.bind(this);
    this.handlemrnSubmit=this.handlemrnSubmit.bind(this);
    this.handleNewAccountSubmit=this.handleNewAccountSubmit.bind(this);
    this.handleNewAdmissionSubmit=this.handleNewAdmissionSubmit.bind(this);

  }

  handleInputChange(event, key) {
    const value = event.target && event.target.value;
    this.setState({form: {
      ...this.state.form,
      [key]: value}});
  }

  handleDateChange(field, { value }) {
    this.setState({form:{
      ...this.state.form,
      [field]: new Date(value)}});
  }


  handleSelectChange(field, { value }) {
    this.setState({form: {
      ...this.state.form,
      [field]: value}});
  }

  handlemrnSubmit(){
    const valid = true;
    // todo: check if email is valid

    // todo: check if email exists in the system
    // if(this.props.getMrn(this.state.form.mrn)){

    // }
    const exists = true;
    const {slideIndex} = this.state;
    if(valid){}
    if(!exists){
      //const index = slideIndex + 2;
      // existing patient
      this.setState({
        exists: true,
        slideIndex: slideIndex + 2});
    }else {
      this.setState({slideIndex: slideIndex + 1})
    }
   }

   handleNewAdmissionSubmit(event){
    //todo: check if admission record is valid
    const valid = true;
    const {slideIndex} = this.state;
    if(valid){
      event.preventDefault();
      const copiedState = Object.assign({...this.state.form});
      if(this.state.exists){
        // existing patient
        //this.props.createAdmissionRecord(copiedState);
      }else {
        //this.props.createUser(copiedState);
        this.setState({isCreated:true});
        //todo: error message
      }
      this.setState({slideIndex: slideIndex + 1});
     }
  }

   handleNewAccountSubmit(){
    //todo:check if new form is valid
    const valid = true;
    const {slideIndex} = this.state;
    if(valid){
      this.setState({slideIndex: slideIndex + 1});
    }else{
      //todo: error message
    }
   }

  rendermrnCheck() {
    return (
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>{STATE_CONST['mrn']}</label>
            <Input placeholder={STATE_CONST['mrn']} onChange={e=>  this.handleInputChange(e, 'mrn')}/>
          </Form.Field>
        </Form>
      </Modal.Content>
      );
  }

  renderNewAdmissionRecord(){
    return(
      <Modal.Content>
        <Form id="create-user">
          <Header>New Admission Record</Header>
          {this.renderFieldHelper(['typeofInjury'])}
          {this.renderRepeatDropDownForm()}
          {this.renderDateHelper('admissionDate')}
          {this.renderDateHelper('dischargeDate')}
        </Form>
      </Modal.Content>)
  }

  renderNewAccount() {
    return(
      <Modal.Content image scrolling>
        <Form id="create-user">
          <Header>Basic Information</Header>

          {this.renderFieldHelper(['firstName', 'lastName'])}
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
              checked={this.state.form.patientType === 'in'}
              onChange={
                (e,data)=>this.handleSelectChange('patientType', data)}
            />
            <Form.Radio
              label='Out Patient'
              value='out'
              checked={this.state.form.patientType === 'out'}
              onChange={
                (e,data)=>this.handleSelectChange('patientType', data)}
            />
          </Form.Group>

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
    const date = this.state.form[field] === '' ? '': moment(this.state.form[field]).format('l');
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
        <Form.Field
        key = {field}
        //error={this.state.error[field]}
        >
        <label>{STATE_CONST[field]}</label>
        <Input placeholder={STATE_CONST[field]} onChange={e=> this.handleInputChange(e, field)}/>
        </Form.Field>
        ))}
      </Container>
      );
  }

  validateField(){
    const errorFields={};
    Object.entries(this.state.form).map(entry => {
      if(entry[1]===''){

        errorFields[entry[0]]=true;
      }
    });
    this.setState({error: errorFields});

    return (!Object.keys(errorFields).length);
  }

  validateForm(){

    this.validateField();
    // if(!this.validateUsername()) this.setState()

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
          {this.state.slideIndex!==4 &&
            <Button
              className="back-btn"
              floated="left"
              onClick={this.onPrevClick}
            >
            Back</Button>}
        </Grid.Column>
        <Grid.Column>
          <Button
            primary
            className="next-btn"
            floated="right"
            onClick={e => this.onNextClick(e)}>
              {this.state.isCreated? "Done": "Create"}
          </Button>
        </Grid.Column>
      </Grid>
    );
  }

  onPrevClick = (e) => {
    if(this.state.slideIndex===1){
      this.props.onPrev();
    }else if(this.state.slideIndex===3 && !this.state.exists){
      this.setState({slideIndex:2});
    } else {
      this.setState({slideIndex:1});
    }
  }

  onNextClick(event){
    const {slideIndex} = this.state;
    switch(slideIndex){
      case 1:
        return this.handlemrnSubmit();
      case 2:
        return this.handleNewAccountSubmit();
      case 3:
        return this.handleNewAdmissionSubmit(event);
      default:
        this.props.onClose();
    }
  }

  renderPage(){
    const {slideIndex} = this.state;
    switch(slideIndex){
      case 1:
        return this.rendermrnCheck();
      case 2:
        return this.renderNewAccount();
      case 3:
        return this.renderNewAdmissionRecord();
      default:
        return this.renderFinal();
    }
  }


  render() {
    const {isCreated} = this.state;
      return (
        <React.Fragment>
          {this.renderPage()}
          <Modal.Actions children={this.renderModalActionButton()}/>
        </React.Fragment>
      )
    }

}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      createUser: UserAction.addUser
//      createAdmissionRecord: PatientAction.createAdmissionRecord
//      getMrn: PatientAction.getPatient
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(CreatePatientPopup);
