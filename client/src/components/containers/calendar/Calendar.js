import React, {Component} from 'react';
import {connect} from 'react-redux';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { Container } from "semantic-ui-react";
import { CalendarPopup } from 'components/containers/popup';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarPopupAction } from 'actions';

// Big Calendar requires explicit height set to properly display contents.
// Need to refactor to make it dynamic according to user screen size.
const containerStyle = {
  height: "600px"
}

class Calendar extends Component {
  constructor(props) {
    super(props);
    moment.locale('en');

    const minTime = new Date();
    const maxTime = new Date();

    minTime.setHours(9,0,0);
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
  }

  componentDidMount() {
    this.props.dispatch(CalendarPopupAction.fetchAppointments());
  }

  toggleAddModal(event) {
    this.setState({
      selectedEvent: event,
      isAddModalOpen: !this.state.isAddModalOpen,
    });
  };

  render() {
    // const today = new Date(new Date().setHours(new Date().getHours() - 3));
    // defaultDate is used for presentation only. Param is year, month indexing, day
    const defaultDate = new Date(2019, 1, 12);
    const localizer = BigCalendar.momentLocalizer(moment);
    return(
      <Container className="calendarContainer" style={containerStyle}>
        <BigCalendar
          selectable
          popup={true}
          localizer={localizer} // used to convert string to time vice versa
          events={this.props.events}
          defaultView={BigCalendar.Views.WORK_WEEK}
          defaultDate={defaultDate}
          views={[BigCalendar.Views.DAY, BigCalendar.Views.WORK_WEEK, BigCalendar.Views.MONTH]}
          min={this.state.minTime}
          max={this.state.maxTime}
          onSelectEvent={this.toggleAddModal}
          onSelectSlot={this.toggleAddModal}
        />
        {this.state.isAddModalOpen ?
          <CalendarPopup isOpen={ this.state.isAddModalOpen }
            onClose={ this.toggleAddModal } event={ this.state.selectedEvent } />
          : null
        }
      </Container>
    );

  }
}

const mapStateToProps = state => ({events: state.calendar});

export default connect(mapStateToProps)(Calendar);