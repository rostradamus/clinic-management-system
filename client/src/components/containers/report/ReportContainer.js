import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { Label, Input, Container } from "semantic-ui-react";
import { ReportAction } from "actions";
import PatientCardMatrix from "./PatientCardMatrix";
import { isEqual } from 'lodash';
import "./ReportContainer.css";

const reportStyle = {
  types: ["I", "II", "III"],
  colors: ["#2a9d8f", "#e9c46a", "#e76f51"],
  labelStyle: (idx) => ({
    backgroundColor: reportStyle.colors[idx]
  })
};

class ReportContainer extends Component {
  componentDidMount() {
    this.props.requestPatients();
  }

  handleSearchText(e, { value }) {
    this.props.setSearchText(value);
  }

  // TODO: refactor for aggregate report to use Semantic-ui-react
  _renderCategoryLabels() {
    return(
      <div>
        <h2 className="category">Category Summaries</h2>
        {reportStyle.types.map((type, idx) => (
          <Label className="label_rc" style={reportStyle.labelStyle(idx)} key={type}>
            <h3 className="type">{type}</h3>
          </Label>
        ))}
      </div>
    )
  }

  render() {
    const { openPopup, popupInfo, patients } = this.props;
    return (
      <Container>
        <Container className="container_ct">
          { this._renderCategoryLabels() }
          <label className="patient">Patients</label>
          <Input onChange={this.handleSearchText.bind(this)} className="search" iconPosition="left" icon="search" placeholder="Search" />
        </Container>
        <PatientCardMatrix
          patients={ patients }
          popupInfo= { popupInfo }
        />
      </Container>
    );
  }
}

const mapStateToProp = state => {
  const { searchText, patients } = state.report;
  const filteredPatients = patients.filter(patient => patient.patientName.toLowerCase().includes(searchText.toLowerCase()) );
  return {
    patients: filteredPatients
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    requestPatients: ReportAction.getPatients,
    setSearchText: ReportAction.setSearchText,
  }, dispatch);
}

export default connect(mapStateToProp, mapDispatchToProps) (ReportContainer);
