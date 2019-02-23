import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal, Form, Input, Select } from 'semantic-ui-react';
import { DateInput, TimeInput } from 'semantic-ui-calendar-react';
import { CalendarPopupAction } from 'actions';
import * as moment from 'moment';
import './CalendarPopup.css';

// constants can be moved to constants dir
const REPEAT_CONST = [
  { key: 'Daily', text: 'Daily', value: 'Daily' },
  { key: 'Weekly', text: 'Weekly', value: 'Weekly' },
  { key: 'Monthly', text: 'Monthly', value: 'Monthly' },
  { key: 'Never', text: 'Never', value: 'Never' }
];

const POPUP_STATE_CONST = {
  patient: "patient",
  practitioner: "practitioner",
  appointmentDate: "appointmentDate",
  start: "start",
  end: "end",
  repeat: "repeat",
  location: "location",
  notes: "notes"
};

class CalendarPopup extends Component {
  constructor(props) {
    super(props);
    moment.locale('en');

    // TODO: requires refactor when database is connected
    this.state = {
      id: -1,
      patient: "",
      practitioner: "",
      appointmentDate: "",
      start: "",
      end: "",
      repeat: "",
      location: "",
      notes: "NOTES OBJECT PLACEHOLDER",
      isUpdateAppointment: false
    };
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSelectChange = this._handleSelectChange.bind(this);
    this._handleTimeChange = this._handleTimeChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // TODO: requires refactor when database is connected
  static getDerivedStateFromProps(nextProps, prevState) {
    const { id, patient, practitioner, start, end, notes, isUpdateAppointment, repeat } = nextProps && nextProps.event;
    const prevStart = prevState && prevState.start;
    if (prevStart === "") {
      return {
        id: isUpdateAppointment ? id : Math.floor(Math.random() * Math.floor(1000)),
        patient: patient,
        practitioner: practitioner,
        appointmentDate: start,
        start: start,
        end: end,
        repeat: repeat != null ? repeat : "Never",
        location: "",
        notes: notes,
        isUpdateAppointment: isUpdateAppointment
      };
    }
    return {};
  }

  _handleInputChange(event, key) {
    const value = event.target && event.target.value;
    this.setState({[key]: value});
  }

  _handleSelectChange(event, { value }) {
    this.setState({ repeat: value });
  }

  _handleTimeChange(event, key, { value }) {
    if (key !== POPUP_STATE_CONST.appointmentDate) {
      const hhmm = value.split(":");
      if (hhmm.length === 2) {
        const appointmentTime = moment(this.state.appointmentDate)
          .hours(parseInt(hhmm[0]))
          .minutes(parseInt(hhmm[1]))
          .toDate();
        this.setState({ [key]: appointmentTime });
      }
    } else {
      this.setState({ [key]: new Date(value) });
    }
  }

  onSubmit(event) {
    event.preventDefault();
    const copiedState = Object.assign(
      {...this.state},
      { title: this._generateTitle(this.state) }
    );
    if (this.state.isUpdateAppointment) {
      this.props.updateAppointment(copiedState);
    } else {
      this.props.createAppointment(copiedState);
    }
    this.props.onClose();
  }

  _generateTitle({ patient, practitioner }) {
    return "Patient: " + patient +
      " - Therapist: " + practitioner;
  }

  _renderModalHeader() {
    //this is for presentation purposes. Update and create is distinguished by this.props.event.title
    return (
      <Modal.Header>
        { this.props.event.title ? "Update Appointment" : "New Appointment" }
      </Modal.Header>
    );
  }

  _renderModalActionButton() {
    //this is for presentation purposes. Update and create is distinguished by this.props.event.title
    return(
      <Button primary
        content={ this.props.event.title ? "Update" : "Create"}
        onClick={ this.onSubmit }
      />
    );
  }

  _renderPatientForm() {
    const placeholder = this.state.patient ? this.state.patient : "Search";
    return(
      <Form.Field >
        <label>Patient *</label>
        <Input icon='search' iconPosition='left' placeholder={ placeholder }
          onChange={e => this._handleInputChange(e, "patient") }
        />
      </Form.Field>
    );
  }

  _renderPractitionerForm() {
    const placeholder = this.state.practitioner ? this.state.practitioner : "Search";
    return(
      <Form.Field >
        <label>Practitioner *</label>
        <Input icon='search' iconPosition='left' placeholder={ placeholder }
          onChange={e => this._handleInputChange(e, "practitioner") }
        />
      </Form.Field>
    );
  }

  _renderDateTimeForm() {
    const {start, end, appointmentDate} = this.state;
    return(
      <Form.Group widths='equal'>
        <Form.Field >
          <label>Date *</label>
          <DateInput
            dateFormat="MM-DD-YYYY"
            name="date"
            placeholder="Date"
            value={moment(appointmentDate).format('l')}
            iconPosition="left"
            onChange={
              (e,data) => this._handleTimeChange(e, "appointmentDate", data)
            }
          />
        </Form.Field>

        <Form.Field >
          <label>Start Time *</label>
          <TimeInput
            name="start"
            placeholder="Start"
            value={ moment(start).format("kk[:]mm") }
            iconPosition="left"
            onChange={
              (e, data) => this._handleTimeChange(e, "start", data)
            }
          />
        </Form.Field>

        <Form.Field >
          <label>End Time *</label>
          <TimeInput
            name="end"
            placeholder="End"
            value={ moment(end).format("kk[:]mm") }
            iconPosition="left"
            onChange={
              (e, data) => this._handleTimeChange(e, "end", data)
            }
          />
        </Form.Field>
      </Form.Group>
    );
  }


  _renderRepeatDropDownForm() {
    const placeholder = this.state.repeat ? this.state.repeat : "Never";
    return(
      <Form.Field
        control={ Select }
        options={ REPEAT_CONST }
        label={{ children: 'Repeat', htmlFor: 'form-select-control-repeat' }}
        placeholder={ placeholder }
        search
        searchInput={{ id: 'form-select-control-repeat' }}
        onChange={ this._handleSelectChange }
      />
    );
  }
  _renderLocationForm() {
    const placeholder = this.state.location ? this.state.location : "Add Location";
    return(
      <Form.Field>
        <label>Location</label>
        <Input placeholder= { placeholder }
          onChange={e => this._handleInputChange(e, "location") }
        />
      </Form.Field>
    );
  }

  _renderNoteForm() {
    const placeholder = this.state.notes ? this.state.notes : "Add Note";
    return(
      <Form.TextArea label='Note' placeholder={ placeholder }
        onChange={e => this._handleInputChange(e, "notes") }
      />
    );
  }

  _renderModalContent() {
    return(
      <Form>
        { this._renderPatientForm() }
        { this._renderPractitionerForm() }
        { this._renderDateTimeForm() }
        { this._renderRepeatDropDownForm() }
        { this._renderLocationForm() }
        { this._renderNoteForm() }
      </Form>
    );
  }

  render() {
    const { onClose, isOpen } = this.props;
    return(
      <Modal className="calendarPopupModal" closeIcon onClose={ onClose } open={ isOpen } >
        { this._renderModalHeader() }
        <Modal.Content children={this._renderModalContent()} />
        <Modal.Actions children={this._renderModalActionButton()} />
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      createAppointment: CalendarPopupAction.createAppointment,
      updateAppointment: CalendarPopupAction.updateAppointment
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(CalendarPopup);