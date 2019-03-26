import React, { Component } from "react";
import { Grid, Card, Label, Container } from "semantic-ui-react";
import { connect } from "react-redux";
import { ReportAction } from "actions";
import { bindActionCreators } from 'redux';
import { helper } from "./helper";
import "./CardsGrid.css";

const reportStyle = {
  label: (idx) => ({ marginRight: "8px", marginTop: "3px", backgroundColor: reportStyle.colors[idx] }),
  colors: ["#2a9d8f", "#e9c46a", "#e76f51"]
};

class CardsGrid extends Component {
  // TEMP SOLUTION
  _createDiagnosisTitle(str) {
    let title = str;

    if (str.length > 0) {
      title = str.charAt(0).toUpperCase() + str.slice(1);
    }

    return title;
  }

  // Create a single card
  _makePatientCard(patient, key) {
    return (
      <Card className="card_ct" onClick={this.props.openPopup} key={key}>
        <Card.Content onClick={() => this.props.setInfo(patient)}>
          <Card.Header className="header_ct">{patient.patientName}</Card.Header>
          <Card.Meta className="meta_ct">
            <span>{patient.patientId}</span>
          </Card.Meta>
          <Card.Description className="description_ct">
            <Label style={reportStyle.label(patient.recordDatas[0].diagnosisCategory - 1)} empty circular key={"#0"} />
            <p className="diagnosis">{this._createDiagnosisTitle(patient.recordDatas[0].diagnosisName)}</p>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }

  // Creare a single row of 4 cards
  _makeRow(patients) {
    const row = patients.map((patient, idx) => {
      return this._makePatientCard(patient, idx);
    });
    return row;
  }

  // Stack rows of patient cards
  _makeRows(patientsList) {
    if (patientsList !== undefined) {
      const subArrays = helper._chunk(patientsList, 5);
      const rows = subArrays.map((subArray, idx) => {
        return this._makeRow(subArray);
      });
      return rows;
    }
  }

  render() {
    const { patients } = this.props;
    return (
      <Container className="disable_scroll outerContainer">
        <Grid className="grid_ct" columns={5}>
          {this._makeRows(patients)}
        </Grid>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    setInfo: ReportAction.setInfoForPopup,
    openPopup: ReportAction.openPopup
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(CardsGrid);