import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { AuthAction } from 'actions';
import { bindActionCreators } from 'redux';


class Login extends Component {
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
      <form onSubmit={this.handleSubmit}>
        <label>
          Email:
          <input type="text" name="email"
          value={this.state.email} onChange={this.handleInputChange} />
        </label>
        <label>
          Password:
          <input type="text" name="password"
          value={this.state.password} onChange={this.handleInputChange} />
        </label>
        <button type="submit">Login</button>
      </form>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({fetchUser: AuthAction.fetchUser}, dispatch);

export default connect(null, mapDispatchToProps)(Login)