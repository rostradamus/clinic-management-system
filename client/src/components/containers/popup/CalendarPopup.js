import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEqual } from 'lodash';
import { Button, Modal, Form, Select } from 'semantic-ui-react';
import { DateInput, TimeInput } from 'semantic-ui-calendar-react';
import { CalendarAction } from 'actions';
import { SearchInput } from 'components/containers/search';
import * as moment from 'moment';
import './CalendarPopup.css';
moment.locale('en');

// constants can be moved to constants dir
const REPEAT_CONST = [
  { key: 'Never', text: 'Never', value: 'Never' },
  { key: 'Daily', text: 'Daily', value: 'Daily' },
  { key: 'Weekly', text: 'Weekly', value: 'Weekly' },
  { key: 'Monthly', text: 'Monthly', value: 'Monthly' }
];

const USER_TYPE = {
  patient: "Patient",
  staff: "Staff"
};

const POPUP_STATE_CONST = {
  patient: "patient",
  staff: "staff",
  start: "start",
  end: "end",
  repeat: "repeat"
};

const POPUP_ERROR_CONST = {
  start: "startTimeError",
  end: "endTimeError"
};

class CalendarPopup extends Component {
  constructor(props) {
    super(props);

    const { event, selectedUser } = props;
    const { start, end, isUpdateAppointment, id, staff, patient } = event;

    this.state = {
      id: id || -1,
      selectedUser,
      patient: selectedUser && selectedUser.type === "Patient" ? selectedUser : (patient || {}),
      staff: selectedUser && selectedUser.type === "Staff" ? selectedUser : (staff || {}),
      start: start,
      end: end,
      repeat: REPEAT_CONST[0].key,
      isUpdateAppointment: isUpdateAppointment,
      // validation fields
      startTimeError: false,
      endTimeError: false
    };

    // Handler functions
    this.handleSearchInputSelect = this.handleSearchInputSelect.bind(this);
    this.handleSearchResult = this.handleSearchResult.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleTimeChange = this._handleTimeChange.bind(this);
    this._handleDateChange = this._handleDateChange.bind(this);

    // Helper functions
    this._updateTimeToCorrectDate = this._updateTimeToCorrectDate.bind(this);
    this._validateTime = this._validateTime.bind(this);
    this._getAppropriateUser = this._getAppropriateUser.bind(this);
    this._isButtonDisabled = this._isButtonDisabled.bind(this);

    // API end point functions
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  /**
   * Function that is passed to SearchInput children that updates this state
   * @param  {User Obj} selectedUser [User Object that is passed when selected]
   * @param  {String} type         [Enum: "Staff", "Patient"]
   */
  handleSearchInputSelect(selectedUser, type) {
    if (type === USER_TYPE.staff) {
      this.setState({ staff: selectedUser });
    } else if (type === USER_TYPE.patient) {
      this.setState({ patient: selectedUser });
    }
  }

  handleSearchResult(key, result) {
    this.setState({ [key]: result });
  }

  _handleInputChange(event, key) {
    const value = event.target && event.target.value;
    this.setState({ [key]: value });
  }

  // TODO: this is for repeat, implement or remove after MVP
  // _handleSelectChange(event, { value }) {
  //   this.setState({ repeat: value });
  // }

  _handleDateChange(event, { value }) {
    const chosenDate = moment(value, "MM-DD-YYYY");
    const updatedStartTime = this._updateTimeToCorrectDate(POPUP_STATE_CONST.start, chosenDate);
    const updatedEndTime = this._updateTimeToCorrectDate(POPUP_STATE_CONST.end, chosenDate);

    if (!updatedStartTime.isBefore(updatedEndTime)) {
      this.setState({
        startTimeError: true,
        endTimeError: true
      });
    }

    this.setState({
      start: updatedStartTime,
      end: updatedEndTime
    });
  }

  _handleTimeChange(event, key, { value }) {
    const hhmm = value.split(":");
    if (hhmm.length === 2) {
      const openTime = moment(this.state[key], "hh:mm:ss").hours(7).minutes(59).seconds(59);
      const closeTime = moment(this.state[key], "hh:mm:ss").hours(17).minutes(0).seconds(1);
      const appointmentTime = moment(this.state[key])
        .hours(parseInt(hhmm[0]))
        .minutes(parseInt(hhmm[1]))
        .seconds(0);

      if (!moment(appointmentTime, "hh:mm:ss").isBetween(openTime, closeTime)) return;

      const timeError = this._validateTime(key, appointmentTime.toDate());
      if (timeError) {
        this.setState({
          [key]: appointmentTime.toDate(),
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
      const prevMoment = moment(this.state[key]);
      if (!prevMoment.isValid()) {
        return chosenDate;
      }
      return moment(this.state[key])
        .year(chosenDate.year())
        .month(chosenDate.month())
        .date(chosenDate.date());
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

  /**
   * Returns appropriate user (staff or patient) depending on selected user and form type
   * @param  {[String]} formType [Enum String "Patient", "Staff"]
   * @return {[User Obj]}  [if it is an update return user obj depending on form type. Otherwise
   *                       return based on selectedUser's type]
   */
   _getAppropriateUser(formType) {
    //TODO: "Patient" and "Staff" move to Constant.
    const {isUpdateAppointment, staff, patient, selectedUser} = this.state;
    if (isUpdateAppointment) {
      return formType === USER_TYPE.patient ? patient : staff;
    }

    return selectedUser.type === formType ? selectedUser : null;
  }

  /**
   * This function is only used to CREATE and UPDATE appointments excluding cancel
   */
  onSubmit(event) {
    event.preventDefault();
    const copiedState = Object.assign(
      {...this.state},
      { start: moment(this.state.start).format("YYYY-MM-DDTHH:mm") },
      { end: moment(this.state.end).format("YYYY-MM-DDTHH:mm") },
      { isCancelled: false }
    );
    if (this.state.isUpdateAppointment) {
      this.props.updateAppointment(copiedState);
    } else {
      this.props.createAppointment(copiedState);
    }
    this.props.onClose();
  }

  /**
   * This function is only used to CANCEL (soft Delete) exisiting appointments
   */
  onCancel(event) {
    const { isUpdateAppointment, id } = this.state;
    if (!isUpdateAppointment) return;

    event.preventDefault();
    this.props.deleteAppointment(id);
    this.props.onClose();
  }

  _renderModalHeader() {
    const { isUpdateAppointment } = this.state;
    return (
      <Modal.Header>
        { isUpdateAppointment ? "Update Appointment" : "New Appointment" }
      </Modal.Header>
    );
  }

  _isButtonDisabled() {
    const { patient, staff, start, end, startTimeError, endTimeError } = this.state;
    return !moment(start).isValid() || !moment(end).isValid()
      || isEqual(patient, {}) || isEqual(staff, {}) ||
      startTimeError || endTimeError;
  }

  _renderModalActionButton() {
    const { isUpdateAppointment } = this.state;
    return(
      <div>
        { isUpdateAppointment ?
          <Button color='red' onClick={ this.onCancel }>
            Cancel
          </Button> :
          null
        }
        <Button
          primary
          disabled={ this._isButtonDisabled() }
          content={ isUpdateAppointment ? "Update" : "Create"}
          onClick={ this.onSubmit }
        />
      </div>
    );
  }

  _renderPatientForm() {
    const { patient, selectedUser } = this.state;
    const patients = this.props.patientsStaffs;
    return(
      <Form.Field error={ (isEqual(patient, {}) || !patient) }>
        <label>Patient *</label>
        <SearchInput
          formType="Patient"
          results={patients}
          handleSearchInputSelect={this.handleSearchInputSelect}
          selectedUser={this._getAppropriateUser(USER_TYPE.patient)}
          isSelectedUser={ selectedUser && selectedUser.type === USER_TYPE.patient }
        />
      </Form.Field>
    );
  }

  _renderStaffForm() {
    const { staff, selectedUser } = this.state;
    const staffs = this.props.patientsStaffs;
    return(
      <Form.Field error={ (isEqual(staff, {}) || !staff) }>
        <label>Staff *</label>
        <SearchInput
          formType="Staff"
          results={staffs}
          handleSearchInputSelect={this.handleSearchInputSelect}
          selectedUser={this._getAppropriateUser(USER_TYPE.staff)}
          isSelectedUser={ selectedUser && selectedUser.type === USER_TYPE.staff }
        />
      </Form.Field>
    );
  }

  _renderDateTimeForm() {
    const {start, end, startTimeError, endTimeError} = this.state;
    const mStart = moment(start);
    const mEnd = moment(end);
    const today = moment();

    return(
      <Form.Group widths='equal'>
        <Form.Field error={ !mStart.isValid() || mStart.isBefore(today) }>
          <label>Date *</label>
          <DateInput
            dateFormat="MM-DD-YYYY"
            name="date"
            placeholder="Date"
            value={ mStart.format("l") }
            iconPosition="left"
            onChange={ (e,data) => this._handleDateChange(e, data) }
          />
        </Form.Field>

        <Form.Field error={ !mStart.isValid() || startTimeError } >
          <label>Start Time *</label>
          <TimeInput
            name="start"
            placeholder="Start"
            value={ mStart.format("HH:mm") }
            iconPosition="left"
            onChange={
              (e, data) => this._handleTimeChange(e, "start", data)
            }
          />
        </Form.Field>

        <Form.Field error={ !mEnd.isValid() || endTimeError } >
          <label>End Time *</label>
          <TimeInput
            name="end"
            placeholder="End"
            value={ mEnd.format("HH:mm") }
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

  _renderModalContent() {
    return(
      <Form>
        { this._renderPatientForm() }
        { this._renderStaffForm() }
        { this._renderDateTimeForm() }
        { /** this._renderRepeatDropDownForm() */}
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
      createAppointment: CalendarAction.createAppointment,
      updateAppointment: CalendarAction.updateAppointment,
      deleteAppointment: CalendarAction.deleteAppointment
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(CalendarPopup);