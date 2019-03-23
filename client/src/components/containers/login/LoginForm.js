import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { AuthAction } from 'actions';
import { bindActionCreators } from 'redux';
import { Form, Button, Segment } from "semantic-ui-react";
import { ReactComponent as Logo } from "assets/logo.svg";
import "./LoginForm.css";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {

    //if (validateForm())
    this.props.loginUser(this.state)
      .then(res => {
        this.props.history.push("/");
      })
      .catch(err => {
        alert(err);
      });
    e.preventDefault();
  }

  // validateForm() {
  //   return this.state.username.length > 0 && this.state.password.length > 0;
  // }

  render() {
    return (
      <div className="loginFormBackground">
        <div className="loginFormWrapper">
          <Logo className="loginLogo" />
          <Segment className="centerLoginSegment">
            <Form onSubmit={this.handleSubmit} className="loginForm" >
              <Form.Field className="loginField">
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  placeholder="Username"
                  value={this.state.username}
                  onChange={this.handleInputChange}
                  style={{ border: "none", padding: "0", height: "50px" }} />
              </Form.Field>
              <Form.Field className="loginField">
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleInputChange}
                  style={{ border: "none", padding: "0", height: "50px" }} />
              </Form.Field>
              <Button primary fluid type="submit" className="loginButton">LOGIN</Button>
            </Form>
          </Segment>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => state.auth;
const mapDispatchToProps = dispatch => bindActionCreators({ loginUser: AuthAction.loginUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginForm));
