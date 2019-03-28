import React, { Component } from "react";
import { Button, Modal, Container, Menu, Table, Icon, Input, Confirm } from "semantic-ui-react";
import { connect } from "react-redux";
import { UserAction } from "actions";
import { bindActionCreators } from 'redux';


const DIR_MAP = {
  "1" : "ascending",
  "-1" : "descending"
}

class DischargedPatientsPopup extends Component{
  constructor(props) {
    super(props);
    this.state = {
      deleteOpen:false,
      items: props.user.itemsDischarged,
      searchText: "",
      sortKeys: [],
      sortDirection: 1
    };
    this._handleSearchInputChange = this._handleSearchInputChange.bind(this);
  }

  _handleSearchInputChange(event, { value }) {
    const { itemsDischarged } = this.props;
    const { sortDirection, sortKeys } = this.state;
    const searchTextItems = itemsDischarged.filter(user => {
      const fullName = `${user.first_name} ${user.last_name}`;
      return fullName.toLowerCase().includes(value) || `${user.phone_number}`.includes(value);
    });

    this.setState({
      searchText: value,
      items: this._getSortedItems(searchTextItems, sortDirection, sortKeys)
    });
  }

  _deleteOpen = () => {
    const {deleteOpen} = this.state;
    this.setState({ deleteOpen: !deleteOpen })
  };

  deleteUser(user) {
    this.props.deletePatient();
  }

  handleSort(keys) {
      const { items, sortDirection } = this.state;
      const newDirection = sortDirection === 1 ? -1 : 1;
      this.setState({
        items: this._getSortedItems(items, newDirection, keys),
        sortDirection: newDirection,
        sortKeys: keys
      });
  }

  _getSortedItems(arr, dir, keys) {
    if (keys.length === 0) return arr;

    return arr.sort((user1, user2) => {
      const comparable1 = keys.reduce((acc, key) => acc + user1[key], "");
      const comparable2 = keys.reduce((acc, key) => acc + user2[key], "");
      if (comparable1 > comparable2)
        return dir;
      if (comparable1 < comparable2)
        return -1 * dir;
      return 0;
    });
  }


  _renderTableRow(user) {
    return (
      <Table.Row
        key={ user.id }>
        <Table.Cell content={`${user.first_name} ${user.last_name}`} />
        <Table.Cell content={user.email} />
        <Table.Cell content={user.phone_number} />
        <Table.Cell content={user.discharged_date} />
        <Table.Cell textAlign="center">
          <Button icon
          onClick={ () => this.props.dispatch(UserAction.deletePatient(user))}>
          <Icon name='delete'/></Button></Table.Cell>
          <Confirm open={this.state.deleteOpen} onCancel={this._deleteOpen} onConfirm={() => this._deleteUser(this.state) }/>
      </Table.Row>
    );
  }
   _closePopup = () => {
    this.props.closePopup();
  };

  render() {
    const { sortKeys, sortDirection, searchText, items } = this.state;
    const direction = DIR_MAP[sortDirection];
    return(
      <Modal size="large" className="createUserPopupModal" closeIcon onClose={this._closePopup} open={ this.props.user.popupDischarged }>
        <Modal.Header>
          Discharged Patients
          </Modal.Header>
            <Modal.Content scrolling>
            <Container>
                  <Input
                    style={{ width: "28rem" }}
                    icon="search"
                    iconPosition="left"
                    placeholder="Search"
                    onChange={ this._handleSearchInputChange } />

                  <Table basic="very" columns={5} selectable sortable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell
                        sorted={sortKeys === "first_name last_name" ? sortDirection : null}
                        onClick={this.handleSort.bind(this, ["first_name", "last_name"])}>
                        Name
                      </Table.HeaderCell>
                      <Table.HeaderCell
                        sorted={sortKeys === "email" ? sortDirection : null}
                        onClick={this.handleSort.bind(this, ["email"])}>
                        Email
                      </Table.HeaderCell>
                      <Table.HeaderCell
                        sorted={sortKeys === "phone_number" ? sortDirection : null}
                        onClick={this.handleSort.bind(this, ["phone_number"])}>
                        Phone
                      </Table.HeaderCell>
                      <Table.HeaderCell
                        sorted={sortKeys === "discharged_date" ? sortDirection : null}
                        onClick={this.handleSort.bind(this, ["discharged_date"])}>
                        Discharged Date
                      </Table.HeaderCell>
                      <Table.HeaderCell>
                        <Icon label="delete"/>
                        Delete
                      </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                  <Table.Body
                    children={ items.map(this._renderTableRow.bind(this)) } />
                  </Table>
                </Container>

            </Modal.Content>
        </Modal>
    );
    }
  }

const mapStateToProps = state => (
  { user: state.user});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { deletePatient: UserAction.deletePatient,
      closePopup: UserAction.closeDischargedPopup },
    dispatch
  );
}


export default connect(mapStateToProps, mapDispatchToProps)(DischargedPatientsPopup)
