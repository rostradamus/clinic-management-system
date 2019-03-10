import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { AuthAction } from 'actions';
import { bindActionCreators } from 'redux';
import { Form, Button } from "semantic-ui-react";


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
    this.setState({[name]: value});
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
    return(
      <Form onSubmit={this.handleSubmit} style={{ width: "30rem", margin: "auto" }}>
        <Form.Field>
          <label style={{ textAlign: "left" }}>
            Username:
          </label>
          <input type="text" name="username" autoComplete="username"
            value={this.state.username} onChange={this.handleInputChange} />
        </Form.Field>
        <Form.Field>
          <label style={{ textAlign: "left" }}>
            Password:
          </label>
          <input type="password" name="password" autoComplete="current-password"
            value={this.state.password} onChange={this.handleInputChange} />
        </Form.Field>
        <Button type="submit">Login</Button>
      </Form>
    )
  }
}

const mapStateToProps = state => state.auth;
const mapDispatchToProps = dispatch => bindActionCreators({loginUser: AuthAction.loginUser}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginForm));
