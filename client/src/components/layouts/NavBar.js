import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Icon } from "semantic-ui-react";
import { ReactComponent as Logo } from "assets/logo.svg";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "",
      // TODO: [REMOVE] TEMP USER FOR POC
      user: {
        name: "Ro Lee"
      }
    };
  }

  _handleItemClick(e, { name }) {
    this.setState({ activeItem: name });
  }

  _createNavButton({path, name, position}) {
    const { activeItem } = this.state;
    const itemStyle = {
      fontWeight: "bold"
    };
    return (
      <Menu.Item
        position={ position }
        className={ `navbar-${position}-item` }
        as={ Link }
        to={ path }
        key={ name }
        name={ name }
        style={ itemStyle }
        active={ activeItem === name }
        onClick={ this._handleItemClick.bind(this) } />
    );
  }

  _renderNavButtons() {
    const menuItems = [
      {
        path: "/appointment",
        name: "Appointments",
        position: "left"
      }, {
        path: "/report",
        name: "Reports",
        position: "left"
      }, {
        path: "/user",
        name: "Users",
        position: "left"
      }
    ];
    return menuItems.map(this._createNavButton.bind(this));
  }

  _renderUserDropDown() {
    const iconStyle = {
      marginRight: "2.5rem"
    };
    const dropDownTriggerIcon = (
      <Icon
        color="teal"
        style={ iconStyle }
        name="user circle outline"
        size="big"/>
    );
    return (
      <Dropdown item
        trigger={ dropDownTriggerIcon }
        icon={ null }
        pointing="top">
        <Dropdown.Menu>
          <Dropdown.Item
            icon="setting"
            text="My Profile"
            as={ Link }
            to="/profile"/>
          <Dropdown.Item
            icon="logout"
            text="Logout"
            as={ Link }
            to="/logout"/>
          <Dropdown.Item
            icon="sign in"
            text="Login"
            as={ Link }
            to="/login"/>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  render() {
    const logoStyle = {
      width: "12rem",
      height: "5rem",
      objectFit: "contain"
    };
    return (
      <Menu
        className="navbar"
        size="huge"
        style={{ boxShadow: "0 0.25rem 0.75rem 0 rgba(0, 0, 0, 0.25)" }}
        pointing secondary>
          <Menu.Menu
            position="left"
            className="navbar-left-group">
            <Menu.Item
              header
              className="navbar-left-item"
              position="left"
              as={ Link }
              to="/"
              onClick={ this._handleItemClick.bind(this) }>
              <Logo style={ logoStyle }/>
            </Menu.Item>
            { this._renderNavButtons() }
          </Menu.Menu>
          <Menu.Menu
            position="right"
            className="navbar-right-group"
            children={ this._renderUserDropDown()  } />
        </Menu>
      );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(NavBar);
