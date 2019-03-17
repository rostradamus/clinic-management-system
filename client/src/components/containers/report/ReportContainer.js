import React, { Component } from "react";
import { connect } from "react-redux";
import { Label, Input, Container } from "semantic-ui-react";
import { ReportAction } from "actions";
import CardsGrid from "./CardsGrid";
import ReportPopup from "components/containers/popup/ReportPopup";
import "./ReportContainer.css";

const reportStyle = {
  types: ["I", "II", "III"],
  colors: ["#2a9d8f", "#e9c46a", "#e76f51"],
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
  componentDidMount() {
    this.props.requestPatients();
  }

  _handleSearch(e, data) {
    this.props.handleSearchChange(data.value);
  }

  render() {
    const CategoryLabels = () => (
      <div>
        <h2 className="category">Category Summaries</h2>
        {reportStyle.types.map((type, idx) => (
          <Label style={reportStyle.labelStyle(idx)} key={type}>
            <h3 className="type">{type}</h3>
          </Label>
        ))}
      </div>
    );

    return (
      <Container>
        <Container className="container_ct">
          <CategoryLabels />
          <label className="patient">Patients</label>
          <Input onChange={this._handleSearch.bind(this)} className="search" iconPosition="left" icon="search" placeholder="Search" />
        </Container>
        <CardsGrid />
        <ReportPopup />
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  requestPatients: () => dispatch(ReportAction.getPatients()),
  handleSearchChange: (input) => dispatch(ReportAction.setSearch(input))
});

const mapStateToProp = (state) => ({
  patientForPopup: state.report.popupInfo,
  openPopup: state.report.openPopup
});

export default connect(
  mapStateToProp,
  mapDispatchToProps
)(ReportContainer);
