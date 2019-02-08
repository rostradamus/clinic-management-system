import React, {Component} from 'react';
// import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

class Header extends Component {

    _renderContent() {
      switch(this.props.auth) {
        case null:
          return;
        case false:
          return(
            <li>
              Login
            </li>
          );
        default:
          return (
            <li>
              <Link to="/login">
                Login
              </Link>
            </li>
          );
      }
    }

    render() {
      return(
        <div className="nav-wrapper">
          <Link to="/" className="left brand-logo">
            Vancouver Coastal Health
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {this._renderContent()}
          </ul>
        </div>
      )
    }
}

export default Header;