import React, { Component } from "react";
import { Modal, Grid, Button, Header, Input, Form, Container, Divider} from "semantic-ui-react";
import { DateInput } from 'semantic-ui-calendar-react';
import * as moment from 'moment';
import { STATE_CONST } from './CreateUserPopup';
import './CreateUserPopup.css';


export default class CreateStaffPopup extends Component{
  constructor(props) {
    super(props);
    moment.locale('en');

    this.state = {
      isCreated:false,
      userName:'',
      password:'',
      firstName: '',
      lastName:'',
      email:'',
      phoneNum:'',
      birthDate:'',
      address:'',
      therapistType:'',
      permissionLevel:'',
      notes:''
    };
    this.handleInputChange=this.handleInputChange.bind(this);
    this.handleDateChange=this.handleDateChange.bind(this);
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

  renderForm() {
    const user = this.props.typeUser;
    return(
      <Modal.Content image scrolling>
        <Form id="create-user">
          <Header>Basic Information</Header>
          {this.renderFieldHelper(['userName', 'password', 'firstName', 'lastName'])}

          {this.renderDateHelper('birthDate')}
          {this.renderFieldHelper(['phoneNum', 'email', 'address'])}

          {user ==='Staff' &&
            <Container>
              <Divider/>
              <Header>Practitioner Information</Header>
              {this.renderFieldHelper(['therapistType'])}
            </Container>
          }

          <Divider/>
          <Header>Permission Level</Header>

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
          onChange={ (e,data) => this.handleDateChange(field, data) }
        />
      </Form.Field>
    );
  }

  renderFieldHelper(fields){
    return(
      <Container>
        {fields.map(field=> (
          <Form.Field key = {field}>
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
            onClick={e => this.onNextClick()}
          >
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
    return (
      <React.Fragment>
        {!this.state.isCreated && this.renderForm()}
        {this.state.isCreated&& this.renderFinal()}
        <Modal.Actions children={this.renderModalActionButton()}/>
      </React.Fragment>
    );
  }
}