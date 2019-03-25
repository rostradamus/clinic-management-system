import React, {Component} from 'react';
// import {connect} from 'react-redux';
import { Grid, Button, Icon } from "semantic-ui-react";
import { PatientStaffSearch } from 'components/containers/popup';
import { CalendarPopup } from 'components/containers/popup';
import moment from 'moment';

const buttonStyle = {
  width: "70%"
}

const gridRowStyle = {
  marginBottom: "16px"
}

const gridColumnStyle = {
  minWidth: "250px"
}

const event = {
  "type_of_therapy": "",
  "start": moment().hours(0).minutes(0).seconds(0).toDate(),
  "end": moment().hours(0).minutes(0).seconds(0).toDate(),
  "patient": {},
  "staff": {},
  isUpdateAppointment: false
}

class CalendarSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCalendarPopupOpen: false,
      isSearchOpen: false
    }

    this.toggleSearchModal = this.toggleSearchModal.bind(this);
    this.toggleCalendarModal = this.toggleCalendarModal.bind(this);
  }

  toggleSearchModal(event) {
    this.setState({
      isSearchOpen: !this.state.isSearchOpen,
    });
  };

  toggleCalendarModal(event) {
    this.setState({ isCalendarPopupOpen: !this.state.isCalendarPopupOpen });
  }

  render() {
    const { isCalendarPopupOpen, isSearchOpen } = this.state;
    const { selectedUser, patientsStaffs, currentUser} = this.props;
    console.log("currentUser",currentUser);
    return(
      <Grid.Column width={2} textAlign="center" style={gridColumnStyle}>
        { currentUser && currentUser.type === "Administrator" ?
          <Grid.Row style={gridRowStyle}>
            <Button
              primary
              size='medium'
              icon labelPosition="right"
              onClick={ this.toggleCalendarModal }
              style={buttonStyle}>
              Create
              <Icon name='plus' />
            </Button>
          </Grid.Row>
          : null
        }

        { currentUser && currentUser.type === "Administrator" ?
          <Grid.Row style={gridRowStyle}>
            <Button
              primary
              size='medium'
              icon labelPosition="right"
              style={buttonStyle}
              onClick={ this.toggleSearchModal }>
              Select View
              <Icon name='users' />
            </Button>
          </Grid.Row>
          : null
        }

        <Grid.Row>
          <Button
            size='medium'
            style={buttonStyle}>
            Print
          </Button>
        </Grid.Row>

        { currentUser && currentUser.type === "Administrator" && isSearchOpen ?
          <PatientStaffSearch isOpen={ isSearchOpen }
            onClose={ this.toggleSearchModal } />
          : null
        }
        { currentUser && currentUser.type === "Administrator" && isCalendarPopupOpen ?
          <CalendarPopup
            isOpen={ isCalendarPopupOpen }
            onClose={ this.toggleCalendarModal }
            event={ event }
            patientsStaffs={ patientsStaffs }
            selectedUser={ selectedUser }
          />
          : null
        }
      </Grid.Column>
    )
  }
}

export default CalendarSideBar;