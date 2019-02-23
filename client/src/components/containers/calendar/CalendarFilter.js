import React, {Component} from 'react';
// import {connect} from 'react-redux';
import { Grid, Button, Icon, Divider, Header } from "semantic-ui-react";

const buttonStyle = {
  width: "70%"
}

class CalendarFilter extends Component {
  render() {
    return(
      <Grid.Column width={3} textAlign="center">
        <Grid.Row>
          <Button primary size='big' icon labelPosition="right" style={buttonStyle}>
            Create
            <Icon name='plus' />
          </Button>
        </Grid.Row>
        <Divider />

        <Header size='tiny'>Filter</Header>
        <Divider hidden />

        <Grid.Row>
          <Button size='big' style={buttonStyle}>Patients</Button>
        </Grid.Row>
        <Divider hidden />

        <Grid.Row>
          <Button size='big' style={buttonStyle}>Practitioners</Button>
        </Grid.Row>
      </Grid.Column>
    )
  }
}

export default CalendarFilter;