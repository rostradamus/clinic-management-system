import React, { Component } from "react";
import { connect } from "react-redux";
import { UserAction } from "actions";
import { Table, Menu, Icon } from "semantic-ui-react";

class UserTable extends Component {
  handleSort(key) {
    this.props.dispatch(UserAction.setSort(key));
  }

  _renderTableRow(user) {
    return (
      <Table.Row
        key={ user.userId }
        onClick={ () =>
          this.props.dispatch(UserAction.openUserPopup(user)) }>
        <Table.Cell content={user.name} />
        <Table.Cell content={user.email} />
        <Table.Cell content={user.type} />
        <Table.Cell content={user.role} />
      </Table.Row>
    );
  }

  render() {
    const { sort, processedUsers } = this.props.user;
    return (
      <Table basic="very" columns={4} selectable sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={sort.key === "name" ? sort.direction : null}
              onClick={this.handleSort.bind(this, "name")}>
              Name
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sort.key === "email" ? sort.direction : null}
              onClick={this.handleSort.bind(this, "email")}>
              Email
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sort.key === "type" ? sort.direction : null}
              onClick={this.handleSort.bind(this, "type")}>
              User Type
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sort.key === "role" ? sort.direction : null}
              onClick={this.handleSort.bind(this, "role")}>
              Role
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body
          children={ processedUsers.map(this._renderTableRow.bind(this)) } />

        <Table.Footer>
          <Table.Row textAlign="center">
            <Table.HeaderCell colSpan="4">
              <Menu pagination>
                <Menu.Item as="a" icon>
                  <Icon name="chevron left" />
                </Menu.Item>
                <Menu.Item as="a">1</Menu.Item>
                <Menu.Item as="a">2</Menu.Item>
                <Menu.Item as="a">3</Menu.Item>
                <Menu.Item as="a">4</Menu.Item>
                <Menu.Item as="a" icon>
                  <Icon name="chevron right" />
                </Menu.Item>
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}
const mapStateToProps = state => {
  const { items, filter, searchText, sort } = state.user;
  const processedUsers = items
    .filter(user =>
      filter === "all" || user.type.toLowerCase() === filter)
    .filter(user =>
      Object.values(user).some(val => val.toString().toLowerCase().includes(searchText.toLowerCase())))
    .sort((user1, user2) => {
      const multiplier = sort.direction === "ascending" ? 1 : -1;
      if (user1[sort.key] > user2[sort.key])
        return multiplier;
      if (user1[sort.key] < user2[sort.key])
        return -1 * multiplier;
      return 0;
    });
  return {
    user: Object.assign({...state.user}, {processedUsers})
  };
};

export default connect(mapStateToProps)(UserTable);