import React, {Component} from 'react';
// import {connect} from 'react-redux';
import { Grid, Button, Icon } from "semantic-ui-react";
import { PatientStaffSearch } from 'components/containers/popup';

const buttonStyle = {
  width: "70%"
}

const gridRowStyle = {
  marginBottom: "16px"
}

const gridColumnStyle = {
  minWidth: "250px"
}

class CalendarSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchOpen: false
    }

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal(event) {
    this.setState({
      isSearchOpen: !this.state.isSearchOpen,
    });
  };

  render() {
    return(
      <Grid.Column width={2} textAlign="center" style={gridColumnStyle}>
        <Grid.Row style={gridRowStyle}>
          <Button
          primary
          size='medium'
          icon labelPosition="right"
          style={buttonStyle}>
          Create
          <Icon name='plus' />
          </Button>
        </Grid.Row>

        <Grid.Row style={gridRowStyle}>
          <Button
            primary
            size='medium'
            icon labelPosition="right"
            style={buttonStyle}
            onClick={() => this.toggleModal()}>
            Select View
            <Icon name='users' />
          </Button>
        </Grid.Row>

        <Grid.Row>
          <Button 
            size='medium' 
            style={buttonStyle}>
            Print
          </Button>
        </Grid.Row>

        {this.state.isSearchOpen ?
          <PatientStaffSearch isOpen={ this.state.isSearchOpen }
            onClose={ this.toggleModal } />
          : null
        }
      </Grid.Column>
    )
  }
}

export default CalendarSideBar;