import React, {Component} from 'react';
import {connect} from 'react-redux';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { Grid, Header } from "semantic-ui-react";
import { CalendarPopup } from 'components/containers/popup';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarPopupAction } from 'actions';
import "./Calendar.css";

// Big Calendar requires explicit height set to properly display contents.
// Need to refactor to make it dynamic according to user screen size.

const gridColumnStyle = {
  minWidth: "750px"
}

const userInfoGridStyle = {
  paddingBottom: "20px"
}

class Calendar extends Component {
  constructor(props) {
    super(props);
    moment.locale('en');

    const minTime = new Date();
    const maxTime = new Date();

    minTime.setHours(8,0,0);
    maxTime.setHours(17,0,0);

    this.state = {
      events : [],
      minTime : minTime,
      maxTime : maxTime,
      showPopup: false,
      newAppointment: {},
      isAddModalOpen: false,
      selectedEvent: {}
    };

    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.parseEventsToCalendarEvents = this.parseEventsToCalendarEvents.bind(this);
  }

  //Todo: find logic to update component state
  static getDerivedStateFromProps(nextProps, prevState) {
    return { events : nextProps.events};
  }

  componentDidMount() {
    // TODO: remove since calendar is not loading schedule on Mount
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
        {...event},
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
  _generateTitle({patient, staff}) {
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
  _generateStartAndEndTime({start_date, start_time, end_date, end_time}) {
    if (!start_date || !start_time || !end_date || !end_time) return {};
    const splitStartTime = start_time.split(":");
    const splitEndTime = end_time.split(":");
    const start = moment(start_date).hours(splitStartTime[0]).minutes(splitStartTime[1]).toDate();
    const end = moment(end_date).hours(splitEndTime[0]).minutes(splitEndTime[1]).toDate();
    return {start , end};
  }

  render() {
    const today = new Date(new Date().setHours(new Date().getHours() - 3));
    const localizer = BigCalendar.momentLocalizer(moment);
    return(
      <Grid.Column width={13} style={gridColumnStyle}>

        <Grid.Row>
          <Header className="calendarUser userName"> NAME</Header>
        </Grid.Row>

        <Grid.Row>
          <p className="calendarUser userType">user TYPE</p>
        </Grid.Row>

        <Grid.Row style={userInfoGridStyle}>
          <p className="calendarUser userId">user ID</p>
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
          <CalendarPopup isOpen={ this.state.isAddModalOpen }
            onClose={ this.toggleAddModal } event={ this.state.selectedEvent } />
          : null
        }
      </Grid.Column>
    );
  }
}

const mapStateToProps = state => ({events: state.calendar});

export default connect(mapStateToProps)(Calendar);