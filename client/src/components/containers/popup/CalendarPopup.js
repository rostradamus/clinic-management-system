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
  { key: 'd', text: 'Daily', value: 'daily' },
  { key: 'w', text: 'Weekly', value: 'weekly' },
  { key: 'm', text: 'Monthly', value: 'monthly' },
  { key: 'n', text: 'Never', value: 'never' }
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

    this.state = {
      [POPUP_STATE_CONST.patient]: "",
      [POPUP_STATE_CONST.practitioner]: "",
      [POPUP_STATE_CONST.appointmentDate]: "",
      [POPUP_STATE_CONST.start]: "",
      [POPUP_STATE_CONST.end]: "",
      [POPUP_STATE_CONST.repeat]: "n",
      [POPUP_STATE_CONST.location]: "",
      [POPUP_STATE_CONST.notes]: "NOTES OBJECT PLACEHOLDER"
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { start, end } = nextProps && nextProps.event;
    const prevStart = prevState && prevState[POPUP_STATE_CONST.start];

    if (prevStart === "") {
      return {
        [POPUP_STATE_CONST.appointmentDate]: start,
        [POPUP_STATE_CONST.start]: start,
        [POPUP_STATE_CONST.end]: end
      };
    }
    return {};
  }

  handleInputChange(event, key) {
    const value = event.target && event.target.value;
    this.setState({[key]: value});
  }

  handleSelectChange(event, { value }) {
    this.setState({
      [POPUP_STATE_CONST.repeat]: value
    });
  }

  handleTimeChange(event, key, { value }) {
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
    this.props.createAppointment(copiedState);
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
      <Button
        content={ this.props.event.title ? "Update" : "Create"}
        primary
        onClick={ this.onSubmit }
      />
    );
  }

  _renderPatientForm() {
    return(
      <Form.Field >
        <label>Patient *</label>
        <Input icon='search' iconPosition='left' placeholder='Search'
          onChange={e => this.handleInputChange(e, POPUP_STATE_CONST.patient) }
        />
      </Form.Field>
    );
  }

  _renderPractitionerForm() {
    return(
      <Form.Field >
        <label>Practitioner *</label>
        <Input icon='search' iconPosition='left' placeholder='Search'
          onChange={e => this.handleInputChange(e, POPUP_STATE_CONST.practitioner) }
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
              (e,data) => this.handleTimeChange(e, POPUP_STATE_CONST.appointmentDate, data)
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
              (e, data) => this.handleTimeChange(e, POPUP_STATE_CONST.start, data)
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
              (e, data) => this.handleTimeChange(e, POPUP_STATE_CONST.end, data)
            }
          />
        </Form.Field>
      </Form.Group>
    );
  }

  _renderRepeatDropDownForm() {
    return(
      <Form.Field
        control={ Select }
        options={ REPEAT_CONST }
        label={{ children: 'Repeat', htmlFor: 'form-select-control-repeat' }}
        placeholder='Never'
        search
        searchInput={{ id: 'form-select-control-repeat' }}
        onChange={ this.handleSelectChange }
      />
    );
  }
  _renderLocationForm() {
    return(
      <Form.Field>
        <label>Location</label>
        <Input placeholder='Add Location'
          onChange={e => this.handleInputChange(e, POPUP_STATE_CONST.location) }
        />
      </Form.Field>
    );
  }

  _renderNoteForm() {
    return(
      <Form.TextArea label='Note' placeholder='Add Note'
        onChange={e => this.handleInputChange(e, POPUP_STATE_CONST.notes) }
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