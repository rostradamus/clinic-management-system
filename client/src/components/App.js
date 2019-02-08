import React, { Component } from 'react';
import axios from "axios";
import { NoteList, NoteDetail } from "components/note";
import Header from "components/header/Header";
import Login from "components/login/Login";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

const divStyle = {
  margin: "4rem",
  textAlign: "center"
};

// const formStyle = {
//   marginTop: "4rem",
//   display: "inline-block"
// };

// const linkStyle = {
//   marginRight: "2rem"
// };

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      msg: ""
    };
  }

  handleNameChange(e) {
    this.setState({name: e.target.value});
  }

  sendHelloToServer(e) {
    e.preventDefault();
    axios.get(`/api/sample/${this.state.name}`)
      .then(res => {
        this.setState({
          name: "",
          msg: res.data.data
        });
      })
      .catch(err => {
        alert(err);
      });
  }

  render() {
    return (
      <Router>
        <div className="App" style={divStyle}>
          <header className="App-header">
            <Header />
          </header>


          <h3>{this.state.msg}</h3>
          <Switch>
            <Route key="noteList" exact path ="/note" component={NoteList} />
            <Route key="noteDetail" path="/note/:id" component={NoteDetail} />
            <Route exact path="/login" component={Login} />
          </Switch>

        </div>
      </Router>
    );
  }
}

// "<form style={formStyle} onSubmit={this.sendHelloToServer.bind(this)}>
//   <input
//     type="text" value={this.state.name}
//     onChange={this.handleNameChange.bind(this)} />
//   <input type="submit" value="Submit" />
// </form>"

export default App;
