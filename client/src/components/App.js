import React, { Component } from "react";
import * as Layouts from "components/layouts";
import * as Containers from "components/containers";
import { Container } from "semantic-ui-react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {

  render() {
    return (
      <Router>
        <div className="App" style={{ height: "100%" }}>
          <Layouts.NavBar />
          <Container className="app-body" style={{ padding: "1rem 0", width: "100%" }}>
            <Switch>
              <Route key="appointment" exact path="/" component={Containers.CalendarContainer} />
              <Route key="appointment" path="/appointment" component={Containers.CalendarContainer} />
              <Route key="report" path="/report" component={Containers.ReportContainer} />
              <Route key="user" path="/user" component={Containers.UserContainer} />
              <Route key="login" exact path="/login" component={Containers.LoginContainer} />
              <Route key="page404" path="/*" component={Layouts.Page404} />
            </Switch>
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
