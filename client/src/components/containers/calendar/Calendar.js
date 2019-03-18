import React, { Component } from 'react';
import { connect } from 'react-redux';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { isEqual } from 'lodash';
import { Grid, Header, Label, Icon, Segment } from "semantic-ui-react";
import { CalendarPopup } from 'components/containers/popup';
import { ReactComponent as PlaceholderImg } from "assets/calendarPlaceholder.svg";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./Calendar.css";

const MAIN_CALENDAR_COL_WIDTH = 13;

class Calendar extends Component {
  constructor(props) {
    super(props);
    moment.locale('en');

    const minTime = new Date();
    const maxTime = new Date();

    minTime.setHours(8, 0, 0);
    maxTime.setHours(17, 0, 0);

    this.state = {
      events: [],
      minTime: minTime,
      maxTime: maxTime,
      showPopup: false,
      isAddModalOpen: false,
      selectedEvent: {},
      selectedUser: {}
      // newAppointment: {}
    };

    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.parseEventsToCalendarEvents = this.parseEventsToCalendarEvents.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.events.length !== prevState.events.length ||
      !isEqual(nextProps.selectedUser, prevState.selectedUser)) {
      // TODO: after auth is implemented include current user
      return { events: nextProps.events, selectedUser: nextProps.selectedUser };
    }
    return {};
  }

  componentDidMount() {
    // TODO: if current.type !== "Administrator" fetchAppointment with current user
  }

  // TODO: requires refactor when database is connected
  toggleAddModal(event, isUpdateAppointment) {
    let selectedEvent = {};
    if (event != null) {
      isUpdateAppointment = isUpdateAppointment || false;
      selectedEvent = Object.assign(event, { isUpdateAppointment });
    }

    this.setState({
      selectedEvent: selectedEvent,
      isAddModalOpen: !this.state.isAddModalOpen,
    });
  };

  parseEventsToCalendarEvents() {
    const { events } = this.state;
    const calendarEvents = events.map(event => {
      return Object.assign(
        { ...event },
        this._generateTitle(event),
        this._generateStartAndEndTime(event)
      );
    });
    return calendarEvents;
  }

  /**
   * Generates Title using event's staff and patient
   * @param  {User} options.patient
   * @param  {User} options.staff
   * @return {Object} [if patient and staff exist return {title:...} else returns {}]
   */
  _generateTitle({ patient, staff }) {
    if (patient && staff) {
      const title = `Patient: ${patient.first_name} ${patient.last_name} - Staff: ${staff.first_name} ${staff.last_name}`;
      return { title };
    }
    return {};
  }

  /**
   * Using events start date, time and end date and time generate a start and end time.
   * This is used for BigCalendar Compatibility.
   * @param  {Date String} options.start_date [Date Object Stringified]
   * @param  {Time String} options.start_time ["HH:MM:SS"]
   * @param  {Date String} options.end_date   [Date Object Stringified]
   * @param  {Time String} options.end_time   ["HH:MM:SS"]
   * @return {Object} [If at least one parameter is null then return an object otherwise returns {start:..., end:...}]
   */
  _generateStartAndEndTime({ start_date, start_time, end_date, end_time }) {
    if (!start_date || !start_time || !end_date || !end_time) return {};
    const splitStartTime = start_time.split(":");
    const splitEndTime = end_time.split(":");
    const start = moment(start_date).hours(splitStartTime[0]).minutes(splitStartTime[1]).toDate();
    const end = moment(end_date).hours(splitEndTime[0]).minutes(splitEndTime[1]).toDate();
    return { start, end };
  }

  /**
   * Give back the proper icon name according to selected user type.
   * @param {String} t
   * @return {String} Name of appropriate icon.
   */
  _getUserTypeIconName(t) {
    let iconTypeName;

    // TODO: this is a code smell, could be better if we had
    // universal enums to store all these.
    if (t === 'Patient') {
      iconTypeName = 'user';
    } else if (t === 'Staff') {
      iconTypeName = 'user md';
    }

    return iconTypeName;
  }

  _isEmptyUserObj(user) {
    return Object.keys(user).length === 0 && user.constructor === Object
  }

  _getSelectedUserName(user) {
    return `${user.first_name} ${user.last_name}`;
  }

  render() {
    const today = new Date(new Date().setHours(new Date().getHours() - 3));
    const localizer = BigCalendar.momentLocalizer(moment);
    const { selectedUser } = this.state;

    // If selectedUser has no fields (basically, empty), show placeholder.
    if (this._isEmptyUserObj(selectedUser)) {
      return (
        <Grid.Column width={MAIN_CALENDAR_COL_WIDTH}>
          <Segment className="calendarPlaceholder">
            <PlaceholderImg className="placeholderImage" />
            {/* <Header textAlign="center"> */}
            <p id="placeholderText">
            Click the "Select View" button to choose either a patient or staff.
            </p>
            {/* </Header> */}
          </Segment>
        </Grid.Column>
      );
    }

    // If selected user exists with expected fields, show calendar.
    return (
      <Grid.Column width={MAIN_CALENDAR_COL_WIDTH}>

        <Grid.Row>
          <Header className="calendarUser userName"> {this._getSelectedUserName(selectedUser)} </Header>
        </Grid.Row>

        <Grid.Row className="calendarUser userTypeRow">
          <Label basic color='black'>
            <Icon name={this._getUserTypeIconName(selectedUser.type)} /> {selectedUser.type}
          </Label>
        </Grid.Row>

        <Grid.Row>
          <BigCalendar
            className="appointmentCalendar"
            selectable
            popup={true}
            localizer={localizer} // used to convert string to time vice versa
            events={this.parseEventsToCalendarEvents()}
            defaultView={BigCalendar.Views.WORK_WEEK}
            defaultDate={today}
            views={[BigCalendar.Views.DAY, BigCalendar.Views.WORK_WEEK, BigCalendar.Views.MONTH]}
            min={this.state.minTime}
            max={this.state.maxTime}
            onSelectEvent={(e) => this.toggleAddModal(e, true)}
            onSelectSlot={(e) => this.toggleAddModal(e, false)}
          />
        </Grid.Row>

        {this.state.isAddModalOpen ?
          <CalendarPopup isOpen={this.state.isAddModalOpen}
            onClose={this.toggleAddModal} event={this.state.selectedEvent} />
          : null
        }
      </Grid.Column>
    );
  }
}

const mapStateToProps = state => {
  // TODO: when auth is connected integrate currentUser from auth
  return { ...state.calendar };
}

export default connect(mapStateToProps)(Calendar);