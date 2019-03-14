import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import Calendar from "./Calendar";
import CalendarSideBar from "./CalendarSideBar";

// Temporary solution for column stacking.
const gridStyle = {
  minWidth: "1000px"
}

export default class CalendarContainer extends Component {
  // TODO: commented out for now to reduce warning messages for compiling
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Grid className="calendarContainer" style={gridStyle}>
        <CalendarSideBar />
        <Calendar />
      </Grid>
    );
  }
}