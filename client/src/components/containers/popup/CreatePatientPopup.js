import React, { Component } from "react";
import { Modal, Grid, Button, Select, Header, Input, Form, Container, Divider} from "semantic-ui-react";
import { DateInput } from 'semantic-ui-calendar-react';
import * as moment from 'moment';
import { UserAction, PatientAction} from 'actions';
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
      patientId:'',
      form: {
        user: {
          first_name: '',
          last_name:'',
          phone_number:'',
          email:'',
          permission_level:''
        },
        patient:{
          mrn:'',
          date_of_birth:'',
          address:'',
          is_in_patient:true,
          patient_program:''
        },
        admission : {
          type_of_injury:'',
          admission_date:'',
          discharge_date:'',
          comment:'',
          patient_category:'1'
        }
      },
      error: {
        mrn:false,
        first_name: false,
        last_name:false,
        phone_number:false,
        date_of_birth:false,
        address:false,
        is_in_patient:false,
        patient_program:false,
        type_of_injury:false,
        admission_date:false,
        patient_category:false
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

  handleInputChange(event, key, formtype) {
    const value = event.target && event.target.value;
    this.setState({form: {
      ...this.state.form,
      [formtype]: {
        ...this.state.form[formtype],
        [key]:value
      }
    },error: {
      ...this.state.error,
        [key]:false
      }
    });
  }

  handleDateChange(field, { value }, formtype) {
    this.setState({form: {
      ...this.state.form,
      [formtype]: {
        ...this.state.form[formtype],
        [field]: new Date(value)}}
      ,error: {
      ...this.state.error,
        [field]:false
      }
    });
  }

  handleSelectChange(field, { value }) {
    if(field === 'is_in_patient') value = !this.state.form.patient.is_in_patient;
    this.setState({form: {
      ...this.state.form,
      patient:{
        ...this.state.form.patient,
      [field]: value}}
    })
  }

  handlemrnSubmit(){
    const mrn = this.state.form.patient['mrn'];
    const valid = this.validateField(['mrn']) && mrn.length == 7 && Number.isInteger(parseInt(mrn,10));
    //  TODO: const exists = this.props.getPatient(mrn)//
    const exists = true;
    const {slideIndex} = this.state;
      if(valid){
        if(exists){
        this.setState({
          exists: true,
          slideIndex: slideIndex + 2});
      }
        else {
        this.setState({slideIndex: slideIndex + 1})
      }
    }
  }

   handleNewAdmissionSubmit(event){
    const admissionFields = ['type_of_injury','admission_date','patient_category'];
    const {slideIndex, form} = this.state;
    event.preventDefault();
    if(this.validateField(admissionFields)){
      const copiedState = Object.assign({...this.state.form});
      if(this.state.exists){
        const admissionRecord = Object.assign(
          {admissionRecord:{
            ...this.state.form.admission,
            patientId: this.state.patientId
          }});
       //TODO: this.props.createAdmissionRecord(admissionRecord);
      }else {
        const { user, patient, admissionRecord } = this.state.form;
       //TODO:  this.props.createUser({user, patient, admissionRecord})
        this.setState({isCreated:true});
        //TODO: error message
      }
      this.setState({slideIndex: slideIndex + 1});
     }
  }

   handleNewAccountSubmit(){
    const fields = ['last_name', 'first_name', 'phone_number', 'mrn','date_of_birth','address','is_in_patient','patient_program'];
    if(this.validateField(fields)){
      const {slideIndex} = this.state;
        this.setState({slideIndex: slideIndex + 1});
      }else{
        //TODO: error message
      }
   }

  rendermrnCheck() {
    return (
      <Modal.Content>
        <Form>
          <Form.Field error= {this.state.error['mrn']}>
            <label>{STATE_CONST['mrn']}</label>
            <Input placeholder={STATE_CONST['mrn']} onChange={e=>  this.handleInputChange(e, 'mrn', 'patient')}/>
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
          {this.renderFieldHelper(['type_of_injury'], 'admission')}
          {this.renderRepeatDropDownForm()}
          {this.renderDateHelper('admission_date', 'admission')}
          {this.renderDateHelper('discharge_date', 'admission')}
          {this.renderNoteForm('comment', 'admission')}
        </Form>
      </Modal.Content>)
  }

  renderNewAccount() {
    return(
      <Modal.Content image scrolling>
        <Form id="create-user">
          <Header>Basic Information</Header>

          {this.renderFieldHelper(['first_name', 'last_name', 'phone_number', 'email'], 'user')}
          {this.renderFieldHelper(['address'], 'patient')}
          {this.renderDateHelper('date_of_birth', 'patient')}

          <Header>Patient Information</Header>

          <Form.Group inline>
            <Form.Radio
              label='In Patient'
              checked={this.state.form.patient.is_in_patient === true}
              onChange={
                (e,data)=>this.handleSelectChange('is_in_patient', data)}
            />
            <Form.Radio
              label='Out Patient'
              checked={this.state.form.patient.is_in_patient === false}
              onChange={
                (e,data)=>this.handleSelectChange('is_in_patient', data)}
            />
          </Form.Group>
          {this.renderFieldHelper(['patient_program'], 'patient')}

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

  renderDateHelper(field, formtype){
    const date = this.state.form[formtype][field] === '' ? '': moment(this.state.form[formtype][field]).format('l');
    return(
      <Form.Field error={this.state.error[field]} className="user-field">
        <label>{STATE_CONST[field]}</label>
        <DateInput
        dateFormat="MM-DD-YYYY"
        placeholder="MM-DD-YYYY"
        value={date}
        iconPosition="left"
        onChange={
          (e,data) => this.handleDateChange(field, data, formtype)
        }
        />
      </Form.Field>
    );
  }

  renderFieldHelper(fields, formtype){
    return(
      <Container>
      {fields.map(field=>(
        <Form.Field
        className="user-field"
        key = {field}
        error={this.state.error[field]}
        >
        <label>{field==="email" ? "Email (Optional)" : STATE_CONST[field]}</label>
        <Input placeholder={STATE_CONST[field]} onChange={e=> this.handleInputChange(e, field, formtype)}/>
        </Form.Field>
        ))}
      </Container>
      );
  }

  validateField(fields){
    const form = this.state.form;
    const errorFields={};
    fields.map(field => {
      if(form.user[field] === '' || form.patient[field] ==='' || form.admission[field] ===''){
        errorFields[field]=true;
      }
    });
    this.setState({error: {
        ...this.state.form.error,
        ...errorFields
      }});
    return (!Object.keys(errorFields).length);
  }

  renderRepeatDropDownForm() {
    return(
      <Form.Field
        defaultValue={'1'}
        className="user-field"
        control={ Select }
        options={ PATIENT_CAT }
        label={{ children: 'Patient Category', htmlFor: 'form-select-control-repeat' }}
        placeholder="1"
        search
        searchInput={{ id: 'form-select-control-repeat' }}
        onChange={
        (e,data)=>this.handleSelectChange('patient_category', data)}
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
              Next
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
      createUser: UserAction.addUser,
      createAdmissionRecord: PatientAction.createAdmissionRecord,
      getPatient: PatientAction.getPatient
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(CreatePatientPopup);
