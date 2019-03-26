import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { Label, Input, Container } from "semantic-ui-react";
import { ReportAction } from "actions";
import CardsGrid from "./CardsGrid";
import ReportPopup from "components/containers/popup/ReportPopup";
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
  constructor(props) {
    super(props);
    this.handleSearchText = this.handleSearchText.bind(this);
  }

  componentDidMount() {
    this.props.requestPatients();
  }

  handleSearchText(e, { value }) {
    this.props.setSearchText(value);
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
    const { openPopup, popupInfo, patients } = this.props;
    return (
      <Container>
        <Container className="container_ct">
          <CategoryLabels />
          <label className="patient">Patients</label>
          <Input onChange={this.handleSearchText} className="search" iconPosition="left" icon="search" placeholder="Search" />
        </Container>
        <CardsGrid patients={ patients } />
        { openPopup && !isEqual(popupInfo, {}) ?
          <ReportPopup
            openPopup= { openPopup }
            popupInfo= { popupInfo }
          />
          : null
        }
      </Container>
    );
  }
}

const mapStateToProp = state => {
  const { openPopup, popupInfo, searchText, patients } = state.report;
  return {
    openPopup,
    popupInfo,
    patients: patients.filter(patient => patient.patientName.toLowerCase().includes(searchText))
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    requestPatients: ReportAction.getPatients,
    setSearchText: ReportAction.setSearchText,
  }, dispatch);
}

export default connect(mapStateToProp, mapDispatchToProps) (ReportContainer);
