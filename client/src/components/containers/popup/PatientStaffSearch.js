import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Menu, Input, Table } from 'semantic-ui-react';
import { PatientStaffSearchAction, CalendarPopupAction } from "actions";

class PatientStaffSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      filteredItems: [],
      searchText: "",
      filter: "all",
      sortKey: "",
      sortDirection: "up"
    }
    this._handleMenuItemClick = this._handleMenuItemClick.bind(this);
    this._handleSearchInputChange = this._handleSearchInputChange.bind(this);
    this._handleUserSelect = this._handleUserSelect.bind(this);
  }

  // Todo
  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log("nextProps",nextProps);
    // console.log("prevState",prevState);
    if (prevState.items.length !== nextProps.items.length) {
      return {
        items: nextProps.items,
        filteredItems: nextProps.items,
        searchText: ""
      }
    }

    return { };
  }

  componentDidMount() {
    this.props.getPatientAndStaff();
  }

  _handleMenuItemClick(event, data) {
    this.setState({ filter: data.name });
  }

  _handleSearchInputChange(event, { value }) {
    const filteredItems = this.state.items.filter(user => {
      const fullName = `${user.first_name} ${user.last_name}`;
      return fullName.toLowerCase().includes(value);
    });

    this.setState({
      searchText: value,
      filteredItems: filteredItems
    });
  }

  handleSort() {

  }

  _handleUserSelect({ id }) {
    this.props.fetchAppointments(id);
    this.props.onClose();
  }

  _renderTableRow(user) {
    return (
      <Table.Row
        key={ user.id }
        onClick={() => this._handleUserSelect(user)}>
        <Table.Cell content={`${user.first_name} ${user.last_name}`} />
        <Table.Cell content={user.email} />
        <Table.Cell content={user.phone_number} />
        <Table.Cell content={user.type} />
      </Table.Row>
    );
  }

  render() {
    const { onClose, isOpen } = this.props;
    const { filter, sortKey, sortDirection, items, searchText, filteredItems } = this.state;

    return (
      <Modal className="calendarPopupModal" closeIcon onClose={onClose} open={isOpen} >
        <Modal.Header>
          <Menu pointing secondary>
            <Menu.Item
              name="all"
              active={filter === "all"}
              onClick={this._handleMenuItemClick}>All</Menu.Item>
            <Menu.Item
              name="staff"
              active={filter === "staff"}
              onClick={this._handleMenuItemClick}>Staff</Menu.Item>
            <Menu.Item
              name="patient"
              active={filter === "patient"}
              onClick={this._handleMenuItemClick}>Patient</Menu.Item>
          </Menu>
        </Modal.Header>

        <Modal.Content>
          <Input
            icon="search"
            iconPosition="left"
            placeholder={searchText === "" ? "Search" : searchText}
            onChange={this._handleSearchInputChange} />

          <Table basic="very" columns={4} selectable sortable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  sorted={sortKey === "first_name last_name" ? sortDirection : null}
                  onClick={this.handleSort.bind(this, ["first_name", "last_name"])}>
                  Name
              </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={sortKey === "email" ? sortDirection : null}
                  onClick={this.handleSort.bind(this, ["email"])}>
                  Email
              </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={sortKey === "phone_number" ? sortDirection : null}
                  onClick={this.handleSort.bind(this, ["phone_number"])}>
                  Phone
              </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={sortKey === "type" ? sortDirection : null}
                  onClick={this.handleSort.bind(this, ["type"])}>
                  User Type
              </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body
              children={ filteredItems.map(this._renderTableRow.bind(this)) } />
          </Table>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return { items: state.patientStaffSearch };
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getPatientAndStaff: PatientStaffSearchAction.getPatientAndStaff,
      fetchAppointments: CalendarPopupAction.fetchAppointments
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientStaffSearch);