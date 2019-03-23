import React, { Component } from "react";
import * as Layouts from "components/layouts";
import * as Containers from "components/containers";
import { Container } from "semantic-ui-react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, hasLoggedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => hasLoggedIn === true ?
        <Component {...props} /> :
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      }
    />
  )
}

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App" style={{ height: "100%" }}>
          <Layouts.NavBar />
          {/* <Container className="app-body" style={{ padding: "1rem 0", width: "100%", height: "100%" }}> */}
          <Container className="app-body" style={{ width: "100%", height: "100%" }}>
            <Switch>
              <Route key="login" exact path="/login" component={Containers.LoginContainer}/>
              <PrivateRoute key="appointment" exact path="/" component={Containers.CalendarContainer} hasLoggedIn={this.props.auth.hasLoggedIn} />
              <PrivateRoute key="appointment" path="/appointment" component={Containers.CalendarContainer} hasLoggedIn={this.props.auth.hasLoggedIn} />
              <PrivateRoute key="report" path="/report" component={Containers.ReportContainer} hasLoggedIn={this.props.auth.hasLoggedIn} />
              <PrivateRoute key="user" path="/user" component={Containers.UserContainer} hasLoggedIn={this.props.auth.hasLoggedIn} />
              <Route key="page404" path="/*" component={Layouts.Page404} />
            </Switch>
          </Container>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  const { auth } = state;
  return { auth };
}
export default connect(mapStateToProps)(App);
