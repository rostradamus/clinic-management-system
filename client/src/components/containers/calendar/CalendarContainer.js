import React, { Component } from "react";
import { connect } from 'react-redux';
import { Grid } from "semantic-ui-react";
import { PatientStaffSearchAction } from 'actions';
import { CalendarAction } from 'actions';
import Calendar from "./Calendar";
import CalendarSideBar from "./CalendarSideBar";

const gridStyle = {
  minWidth: "1000px",
  height: "100%"
}

class CalendarContainer extends Component {
  constructor(props) {
    super(props);
    this.handleErrorMessageClose = this.handleErrorMessageClose.bind(this);
  }

  componentDidMount() {
    const { currentUser } = this.props;
    if (currentUser && currentUser.type !== "Administrator") {
      this.props.dispatch(CalendarAction.fetchAppointments(currentUser));
    }
    this.props.dispatch(PatientStaffSearchAction.getPatientAndStaff());
  }

  handleErrorMessageClose() {
    this.props.dispatch(CalendarAction.resetErrorMessage());
  }

  render() {
    const { errorMessage, events, selectedUser, patientsStaffs, currentUser} = this.props;
    return (
      <Grid className="calendarContainer" style={gridStyle}>
        <CalendarSideBar
          selectedUser={ selectedUser }
          patientsStaffs={ patientsStaffs }
          currentUser = { currentUser }
        />
        <Calendar
          errorMessage={ errorMessage }
          events={ events }
          selectedUser={ selectedUser }
          patientsStaffs={ patientsStaffs }
          currentUser = { currentUser }
          closeErrorMessage = { this.handleErrorMessageClose }
        />
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.calendar,
    patientsStaffs: state.patientStaffSearch,
    currentUser: state.auth.current_user
  };
}

export default connect(mapStateToProps)(CalendarContainer);