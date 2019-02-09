import React, {Component} from 'react';
// import {connect} from 'react-redux';
// import {Link} from 'react-router-dom';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const events = [];

class Calendar extends Component {

  constructor(props) {
    super(props);

    const minTime = new Date();
    minTime.setHours(9,0,0);
    const maxTime = new Date();
    maxTime.setHours(17,0,0);

    moment.locale('en');

    this.state = {
      events : events,
      minTime : minTime,
      maxTime : maxTime
    };
  }

  render() {
    const localizer = BigCalendar.momentLocalizer(moment);
    return(
      <div className="calendarContainer">
        <BigCalendar
          selectable
          localizer={localizer} // used to convert string to time vice versa
          events={this.state.events}
          defaultView={BigCalendar.Views.WORK_WEEK}
          defaultDate={new Date(2018, 2, 8)}
          views={[BigCalendar.Views.DAY, BigCalendar.Views.WORK_WEEK, BigCalendar.Views.MONTH]}
          min={this.state.minTime}
          max={this.state.maxTime}
        />
      </div>
    );
  }
}


export default Calendar;