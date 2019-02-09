import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { AuthAction } from 'actions';
import { bindActionCreators } from 'redux';
import { Form, Button } from "semantic-ui-react";


class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
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
    this.props.fetchUser(this.state.email, this.state.password);
    e.preventDefault();
  }

  // validateForm() {
  //   return this.state.email.length > 0 && this.state.password.length > 0;
  // }

  render() {
    return(
      <Form onSubmit={this.handleSubmit} style={{ width: "30rem", margin: "auto" }}>
        <Form.Field>
          <label style={{ textAlign: "left" }}>
            Email:
          </label>
          <input type="text" name="emacil"
            value={this.state.email} onChange={this.handleInputChange} />
        </Form.Field>
        <Form.Field>
          <label style={{ textAlign: "left" }}>
            Password:
          </label>
          <input type="password" name="password"
            value={this.state.password} onChange={this.handleInputChange} />
        </Form.Field>
        <Button type="submit">Login</Button>
      </Form>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({fetchUser: AuthAction.fetchUser}, dispatch);

export default connect(null, mapDispatchToProps)(LoginForm)