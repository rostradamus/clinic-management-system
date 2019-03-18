import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Menu, Dropdown, Icon } from "semantic-ui-react";
import { ReactComponent as Logo } from "assets/logo.svg";
import { AuthAction } from "actions";
import '../../css/navBar.css';

const MENU_TITLE_1 = "APPOINTMENTS";
const MENU_TITLE_2 = "REPORTS";
const MENU_TITLE_3 = "USERS";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: MENU_TITLE_1,
      // TODO: [REMOVE] TEMP USER FOR POC
      user: {
        name: "Ro Lee"
      }
    };
  }

  _handleItemClick(e, { name }) {
    this.setState({ activeItem: name });
  }

  _createNavButton({ path, name, position }) {
    const { activeItem } = this.state;
    return (
      <Menu.Item
        position={position}
        className={`navbar-${position}-item`}
        as={Link}
        to={path}
        key={name}
        name={name}
        active={activeItem === name}
        onClick={this._handleItemClick.bind(this)} />
    );
  }

  _renderNavButtons() {
    const menuItems = [
      {
        path: "/appointment",
        name: MENU_TITLE_1,
        position: "left"
      }, {
        path: "/report",
        name: MENU_TITLE_2,
        position: "left"
      }, {
        path: "/user",
        name: MENU_TITLE_3,
        position: "left"
      }
    ];
    return menuItems.map(this._createNavButton.bind(this));
  }

  _renderUserDropDown() {
    const dropDownTriggerIcon = (
      <Icon
        className="menuUserIcon"
        name="user circle outline"
        size="big" />
    );

    return (
      <Dropdown
        item
        icon={null}
        trigger={dropDownTriggerIcon}
        pointing>
        <Dropdown.Menu>
          <Dropdown.Item
            key="profile"
            icon="setting"
            text="My Profile"
            as={Link}
            to="/profile" />
          <Dropdown.Item
            key="logout"
            icon="log out"
            text="Logout"
            onClick={this.props.dispatch.bind(this, AuthAction.logoutUser(this.props.history))} />
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  _renderUserLogin() {
    return (
      <Menu.Item
        icon="sign in"
        name='login'
        as={Link}
        to="/login"
      />
    );
  }

  render() {
    return (
      <Menu
        className="navbar"
        borderless>
        <Menu.Menu
          position="left"
          className="navbar-left-group">
          <Menu.Item
            className="navbar-logo-item"
            position="left"
            as={Link}
            to="/"
            name={MENU_TITLE_1}
            onClick={this._handleItemClick.bind(this)}>
            <Logo className="mainLogo" />
          </Menu.Item>
          {this._renderNavButtons()}
        </Menu.Menu>
        <Menu.Menu
          position="right"
          className="navbar-right-group"
          children={this.props.auth.hasLoggedIn ? this._renderUserDropDown() : this._renderUserLogin()} />
      </Menu>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(withRouter(NavBar));
