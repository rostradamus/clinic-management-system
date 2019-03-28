import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { Label, Input, Container, Grid, Card } from "semantic-ui-react";
import { ReportAction } from "actions";
import PatientCardMatrix from "./PatientCardMatrix";
import { AggregateReportPopup } from "components/containers/popup";
import { isEqual } from 'lodash';
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
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Card
              style={{backgroundColor: "#2a9d8f"}}
              className="card_category"
              header="I"
              onClick={(e, data) => this.handleAggregateToggle(e, 1)}
            />
          </Grid.Column>
          <Grid.Column>
            <Card
              style={{backgroundColor: "#e9c46a"}}
              className="card_category"
              header="II"
              onClick={(e, data) => this.handleAggregateToggle(e, 2)}
            />
          </Grid.Column>
          <Grid.Column>
            <Card
              style={{backgroundColor: "#e76f51"}}
              className="card_category"
              header="III"
              onClick={(e, data) => this.handleAggregateToggle(e, 3)}
            />
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
        <Container className="reportHeaderContainer">
          <h2 className="category_header">Category Summaries</h2>
          { this._renderCategoryLabels() }
          <label className="patient">Patients</label>
          <Input onChange={this.handleSearchText.bind(this)} className="search" iconPosition="left" icon="search" placeholder="Search" />
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
