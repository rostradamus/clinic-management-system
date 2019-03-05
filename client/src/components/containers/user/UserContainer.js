import React, { Component } from "react";
import {connect} from 'react-redux';
import UserTable from "./UserTable";
import { UserPopup, CreateUserPopup } from "components/containers/popup";
import { Container, Button, Menu, Input } from "semantic-ui-react";
import { UserAction } from "actions";


class UserContainer extends Component {
  constructor(props) {
    super(props);

    this.state={
      isCreateUserModelOpen: false
    };
    this.handleCreateNewUserClick = this.handleCreateNewUserClick.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(UserAction.setFilter("all"));
    this.props.dispatch(UserAction.setSort([]));
    this.props.dispatch(UserAction.setSearchText(""));
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

  handleCreateNewUserClick(){
    this.setState({
      isCreateUserModelOpen: !this.state.isCreateUserModelOpen
    });
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
            name="administrator"
            active={ filter === "administrator" }
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
        <Button
          primary
          style={{ margin:"1rem"}}
          onClick={ this.handleCreateNewUserClick }>Create User</Button>
        <CreateUserPopup isOpen={ this.state.isCreateUserModelOpen } onClose={ this.handleCreateNewUserClick }/>
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