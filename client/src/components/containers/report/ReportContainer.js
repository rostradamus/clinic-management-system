import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { Input, Container, Grid, Card, Header } from "semantic-ui-react";
import { ReportAction } from "actions";
import PatientCardMatrix from "./PatientCardMatrix";
import { AggregateReportPopup } from "components/containers/popup";
import "./ReportContainer.css";


class ReportContainer extends Component {
  componentDidMount() {
    this.props.getAllIndividualStats();
  }

  handleSearchText(e, { value }) {
    this.props.setSearchText(value);
  }

  handleAggregateToggle(event, category) {
    event && event.preventDefault();
    this.props.getAggregateSummaryByCategory(category);
  }

  _renderCategoryLabels() {
    return(
      <Grid columns='equal'>
        <Grid.Row className="categoryCardRow">
          <Grid.Column>
            <Card
              id="categoryOne"
              className="categoryCard"
              header="I"
              onClick={(e, data) => this.handleAggregateToggle(e, 1)}
            />
          </Grid.Column>

          <Grid.Column>
            <Card
              id="categoryTwo"
              className="categoryCard"
              header="II"
              onClick={(e, data) => this.handleAggregateToggle(e, 2)}
            />
          </Grid.Column>

          <Grid.Column>
            <Card
              id="categoryThree"
              className="categoryCard"
              header="III"
              onClick={(e, data) => this.handleAggregateToggle(e, 3)}
            />
          </Grid.Column>

          <Grid.Column>
            {/** Left in hear for spacing*/}
          </Grid.Column>
          <Grid.Column>
            {/** Left in hear for spacing*/}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  render() {
    const { isAggregateOpen, categorySummary, selectedCategory,
      popupInfo, patients, closeAggregateSummaryPopup } = this.props;

    return (
      <Container className="reportContainer">
        <Container className="reportSubContainer reportCategoryContainer">
          <Header as='h1'>Aggregate Reports</Header>
          { this._renderCategoryLabels() }
        </Container>
        <Container className="reportSubContainer reportPatientListContainer">
          <Header as='h1'>Individual Reports</Header>
          <Input
            onChange={this.handleSearchText.bind(this)}
            className="searchInput"
            iconPosition="left"
            icon="search"
            placeholder="Search by patient"
          />
        </Container>
        <PatientCardMatrix
          patients={ patients }
          popupInfo= { popupInfo }
        />
        { isAggregateOpen ?
          <AggregateReportPopup
            isOpen={ isAggregateOpen }
            categorySummary={ categorySummary }
            onClose={ closeAggregateSummaryPopup }
            selectedCategory={ selectedCategory }
          /> : null
        }
      </Container>
    );
  }
}

const mapStateToProp = state => {
  const { searchText, patients, categorySummary, isAggregateOpen, selectedCategory } = state.report;
  const filteredPatients = patients.filter(patient => patient.patientName.toLowerCase().includes(searchText.toLowerCase()) );
  return {
    selectedCategory,
    categorySummary,
    isAggregateOpen,
    patients: filteredPatients
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    getAllIndividualStats: ReportAction.getAllIndividualStats,
    setSearchText: ReportAction.setSearchText,
    getAggregateSummaryByCategory: ReportAction.getAggregateSummaryByCategory,
    closeAggregateSummaryPopup: ReportAction.closeAggregateSummaryPopup
  }, dispatch);
}

export default connect(mapStateToProp, mapDispatchToProps) (ReportContainer);
