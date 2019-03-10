import React, { Component } from "react";
import { connect } from "react-redux";
import { Label, Input } from "semantic-ui-react";
import { ReportAction } from "actions";
import CardsGrid from "./CardsGrid";
import ReportPopup from "components/containers/popup/ReportPopup";

const reportStyle = {
  container: { display: "flex", flexDirection: "column" },
  patient: { fontSize: "28px", fontWeight: "300", paddingTop: "20px", paddingBottom: "10px" },
  search: { width: "460px", height: "49px", marginTop: "10px", textAlign: "left" },
  type: { fontSize: "32px", color: "#000000" },
  category: { fontSize: "28px", color: "#000000", fontWeight: "300", margin: "0px" },
  types: [ "I", "II", "III" ],
  colors: [ "#2a9d8f", "#e9c46a", "#e76f51" ],
  labelStyle: (idx) => ({
    width: "200px",
    height: "100px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.25)",
    backgroundColor: reportStyle.colors[idx],
    textAlign: "center",
    margin: "20px",
    marginLeft: "0px",
    paddingTop: "28px"
  })
};

class ReportContainer extends Component {
  _handleSearch(e, data) {
    this.props.handleSearchChange(data.value);
  }

  render() {
    const CategoryLabels = () => (
      <div>
        <h2 style={reportStyle.category}>Category Summaries</h2>
        {reportStyle.types.map((type, idx) => (
          <Label style={reportStyle.labelStyle(idx)} key={type}>
            <h3 style={reportStyle.type}>{type}</h3>
          </Label>
        ))}
      </div>
    );

    return (
      <div className="ui container">
        <div style={reportStyle.container}>
          <CategoryLabels />
          <label style={reportStyle.patient}>Patients</label>
          <Input onChange={this._handleSearch.bind(this)} style={reportStyle.search} iconPosition="left" icon="search" placeholder="Search" />
        </div>
        <CardsGrid />
        <ReportPopup />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleSearchChange: input => dispatch(ReportAction.setSearch(input))
});

const mapStateToProp = (state) => ({
  patientForPopup: state.report.popupInfo,
  openPopup: state.report.openPopup,
  patients: state.report.patients
});

export default connect(mapStateToProp, mapDispatchToProps)(ReportContainer);
