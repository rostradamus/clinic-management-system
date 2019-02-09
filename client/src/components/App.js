import React, { Component } from 'react';
import { NoteList, NoteDetail } from "components/note";
import * as Layouts from "components/layouts";
import * as Containers from "components/containers";
import { Container } from "semantic-ui-react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div className="App" style={ {height: "100%"} }>
          <Layouts.NavBar />
          <Container
            className="app-body"
            textAlign="center"
            style={{ padding: '1rem 0' }}>
            <Switch>
              <Route key="appointment" path="/appointment" component={Containers.CalendarContainer} />
              <Route key="report" path="/report" component={Containers.ReportContainer} />
              <Route key="user" path="/user" component={Containers.UserContainer} />
              <Route exact path="/login" component={Containers.LoginContainer} />
            </Switch>
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
