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
    backgroundColor: reportStyle.colors[idx]
  })
};

class ReportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredPatients: []
    };
    this._handleSearch = this._handleSearch.bind(this);
    this._filterPatients = this._filterPatients.bind(this);
  }

  componentDidMount() {
    this.props.requestPatients().then(() => {
      this.setState({ filteredPatients: this.props.patients });
    });
  }

  _handleSearch(e, data) {
    this._filterPatients(data.value);
  }

  _filterPatients(searchField) {
    const { patients } = this.props;
    let filteredPatients = null;
    if (patients !== null) {
      filteredPatients = patients.filter((patient) => {
        return patient.patientName.toLowerCase().search(searchField.toLowerCase()) !== -1;
      });
      this.setState({ filteredPatients: filteredPatients });
    }
  }

  render() {
    const CategoryLabels = () => (
      <div>
        <h2 className="category">Category Summaries</h2>
        {reportStyle.types.map((type, idx) => (
          <Label className="label_rc" style={reportStyle.labelStyle(idx)} key={type}>
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
        <CardsGrid patients={this.state.filteredPatients} />
        <ReportPopup />
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  requestPatients: () => dispatch(ReportAction.getPatients())
});

const mapStateToProp = (state) => ({
  openPopup: state.report.openPopup,
  patients: state.report.patients
});

export default connect(
  mapStateToProp,
  mapDispatchToProps
)(ReportContainer);
