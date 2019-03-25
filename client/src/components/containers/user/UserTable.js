import React, { Component } from "react";
import { connect } from "react-redux";
import { UserAction } from "actions";
import { Table, Menu, Icon } from "semantic-ui-react";

class UserTable extends Component {
  handleSort(keys) {
    this.props.dispatch(UserAction.setSort(keys));
  };

  _renderTableRow(user) {
    return (
      <Table.Row
        key={ user.id }
        onClick={ () =>
          this.props.dispatch(UserAction.openUserPopup(user)) }>
        <Table.Cell content={`${user.first_name} ${user.last_name}`} />
        <Table.Cell content={user.email} />
        <Table.Cell content={user.phone_number} />
        <Table.Cell content={user.type} />
        <Table.Cell content={user.permission_level} />
      </Table.Row>
    );
  }

  render() {
    const { sort, processedUsers } = this.props.user;
    const sortKey = sort.keys.join(" ");
    return (
      <Table basic="very" columns={5} selectable sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={sortKey === "first_name last_name" ? sort.direction : null}
              onClick={this.handleSort.bind(this, ["first_name", "last_name"])}>
              Name
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortKey === "email" ? sort.direction : null}
              onClick={this.handleSort.bind(this, ["email"])}>
              Email
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortKey === "phone_number" ? sort.direction : null}
              onClick={this.handleSort.bind(this, ["phone_number"])}>
              Phone
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortKey === "type" ? sort.direction : null}
              onClick={this.handleSort.bind(this, ["type"])}>
              User Type
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortKey === "permission_level" ? sort.direction : null}
              onClick={this.handleSort.bind(this, ["permission_level"])}>
              Permission
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body
          children={ processedUsers.map(this._renderTableRow.bind(this)) } />

        {/*<Table.Footer>
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
        </Table.Footer>*/}
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
      const comparable1 = sort.keys.reduce((acc, key) => acc + user1[key], "");
      const comparable2 = sort.keys.reduce((acc, key) => acc + user2[key], "");
      if (comparable1 > comparable2)
        return multiplier;
      if (comparable1 < comparable2)
        return -1 * multiplier;
      return 0;
    });
  return {
    user: Object.assign({...state.user}, {processedUsers})
  };
};

export default connect(mapStateToProps)(UserTable);