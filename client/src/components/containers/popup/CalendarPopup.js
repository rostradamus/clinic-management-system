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

const POPUP_ERROR_CONST = {
  start: "startTimeError",
  end: "endTimeError"
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
      isUpdateAppointment: false,
      // validation fields
      startTimeError: false,
      endTimeError: false
    };

    this.handleSearchResult = this.handleSearchResult.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSelectChange = this._handleSelectChange.bind(this);
    this._handleTimeChange = this._handleTimeChange.bind(this);
    this._handleDateChange = this._handleDateChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this._updateTimeToCorrectDate = this._updateTimeToCorrectDate.bind(this);
    this._validateTime = this._validateTime.bind(this);
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

  handleSearchResult(key, result) {
    this.setState({ [key]: result });
  }

  _handleInputChange(event, key) {
    const value = event.target && event.target.value;
    this.setState({ [key]: value });
  }

  _handleSelectChange(event, { value }) {
    this.setState({ repeat: value });
  }

  _handleDateChange(event, { value }) {
    if (value === "Invalid Date") return;

    const chosenDate = moment(value, "MM-DD-YYYY");
    const updatedStartTime = this._updateTimeToCorrectDate(POPUP_STATE_CONST.start, chosenDate);
    const updatedEndTime = this._updateTimeToCorrectDate(POPUP_STATE_CONST.end, chosenDate);
    this.setState({
      appointmentDate: chosenDate.toDate(),
      start: updatedStartTime,
      end: updatedEndTime
    });
  }

  _handleTimeChange(event, key, { value }) {
    const hhmm = value.split(":");
    if (hhmm.length === 2) {
      const appointmentTime = moment(this.state.appointmentDate)
        .hours(parseInt(hhmm[0]))
        .minutes(parseInt(hhmm[1]))
        .toDate();

      const timeError = this._validateTime(key, appointmentTime);
      if (timeError) {
        this.setState({
          [key]: appointmentTime,
          [POPUP_ERROR_CONST[key]]: timeError
        });
      } else {
        this.setState({
          [key]: appointmentTime,
          startTimeError: false,
          endTimeError: false
        });
      }
    }
  }

  /**
   * @param  {[String]} key [Will be either "start" or "end"]
   * @param  {[Moment Obj]} chosenDate [Moment obj with date format MM-DD-YYYY]
   * @return {[Date]}
   */
  _updateTimeToCorrectDate(key ,chosenDate) {
    if (key === POPUP_STATE_CONST.start || key === POPUP_STATE_CONST.end) {
      return moment(this.state[key])
        .year(chosenDate.year())
        .month(chosenDate.month())
        .date(chosenDate.date())
        .toDate();
    }
    // default error handling, may customize when necessary.
    return new Date();
  }

  /**
   * @param  {[String]} key [Will be either "start" or "end"]
   * @param  {[Date]} time [end users chosen time wrapped in Date() object]
   * @return {[boolean]} true if startTime doesn't conflict with endTime
   */
  _validateTime(key, time) {
    const isKeyStart = key === POPUP_STATE_CONST.start;
    const startTime = isKeyStart ? moment(time) : moment(this.state.start);
    const endTime = isKeyStart ? moment(this.state.end) : moment(time);
    return !startTime.isBefore(endTime);
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
    const { isUpdateAppointment } = this.state;
    return (
      <Modal.Header>
        { isUpdateAppointment ? "Update Appointment" : "New Appointment" }
      </Modal.Header>
    );
  }

  _renderModalActionButton() {
    const { isUpdateAppointment } = this.state;
    return(
      <Button primary
        content={ isUpdateAppointment ? "Update" : "Create"}
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
          onChange={e => this._handleInputChange(e, "staff") }
        />
      </Form.Field>
    );
  }

  _renderDateTimeForm() {
    const {start, end, appointmentDate, startTimeError, endTimeError} = this.state;
    return(
      <Form.Group widths='equal'>
        <Form.Field >
          <label>Date *</label>
          <DateInput
            dateFormat="MM-DD-YYYY"
            name="date"
            placeholder="Date"
            value={ moment(appointmentDate).format("l") }
            iconPosition="left"
            onChange={ (e,data) => this._handleDateChange(e, data) }
          />
        </Form.Field>

        <Form.Field error={ startTimeError } >
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

        <Form.Field error={ endTimeError } >
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