import React, { Component } from "react";
import {connect} from 'react-redux';
import UserTable from "./UserTable";
import { UserPopup } from "components/containers/popup";
import { Container, Menu, Input } from "semantic-ui-react";
import { UserAction } from "actions";

class UserContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(UserAction.getUsers());
  }

  _handleMenuItemClick = (e, { name }) => {
    this.props.dispatch(UserAction.setFilter(name));
  };

  _handleSearchInputChange = (e, { value }) => {
    this.props.dispatch(UserAction.setSearchText(value));
  };

  render() {
    const { filter, searchText, filteredItems } = this.props.user;
    return (
      <Container>
        <Menu pointing secondary>
          <Menu.Item
            name="all"
            active={ filter === "all" }
            onClick={ this._handleMenuItemClick }>All</Menu.Item>
          <Menu.Item
            name="admin"
            active={ filter === "admin" }
            onClick={ this._handleMenuItemClick }>Admins</Menu.Item>
          <Menu.Item
            name="staff"
            active={ filter === "staff" }
            onClick={ this._handleMenuItemClick }>Staffs</Menu.Item>
          <Menu.Item
            name="patient"
            active={ filter === "patient" }
            onClick={ this._handleMenuItemClick }>Patients</Menu.Item>
        </Menu>
        <Input
          style={{ width: "28rem" }}
          icon="search"
          iconPosition="left"
          placeholder="Search"
          onChange={ this._handleSearchInputChange } />
        <UserTable />
        <UserPopup />
      </Container>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(UserContainer);