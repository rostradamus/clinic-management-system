import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import Calendar from "./Calendar";
import CalendarFilter from "./CalendarFilter";


export default class CalendarContainer extends Component {
  // TODO: commented out for now to reduce warning messages for compiling
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Grid className="calendarContainer">
        <CalendarFilter />
        <Calendar />
      </Grid>
    );
  }
}