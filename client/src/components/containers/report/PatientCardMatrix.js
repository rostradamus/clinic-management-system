import React, { Component } from "react";
import { Grid, Card, Label, Container } from "semantic-ui-react";
import { IndividualReportPopup } from "components/containers/popup";
import "./PatientCardMatrix.css";

const COLUMN_COUNT = 5;
const reportStyle = {
  label: (idx) => ({ marginRight: "8px", marginTop: "3px", backgroundColor: reportStyle.colors[idx] }),
  colors: ["#2a9d8f", "#e9c46a", "#e76f51"]
};

class PatientCardMatrix extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReportOpen: false,
      selectedPatient: {}
    };
    this._renderPatientCard = this._renderPatientCard.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal(patient) {
    this.setState({
      isReportOpen: !this.state.isReportOpen,
      selectedPatient: patient
    });
  }

  _getDiagnosis(diagnosis) {
    return diagnosis.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  _segmentToChunk(array, size) {
    const chunked_arr = [];
    for (let i = 0; i < array.length; i++) {
      const last = chunked_arr[chunked_arr.length - 1];
      if (!last || last.length === size) {
        chunked_arr.push([array[i]]);
      } else {
        last.push(array[i]);
      }
    }
    return chunked_arr;
  }

  _renderPatientCard(patient, key) {
    const recordData = patient.recordDatas[0];

    return (
      <Card className="card_ct" key={ key } onClick={() => this.toggleModal(patient)} >
        <Card.Content >
          <Card.Header className="header_ct">{patient.patientName}</Card.Header>
          <Card.Meta className="meta_ct">
            <span>{patient.patientId}</span>
          </Card.Meta>
          <Card.Description className="description_ct">
            <Label style={reportStyle.label(recordData.diagnosisCategory - 1)} empty circular key={"#0"} />
            <p className="diagnosis">{this._getDiagnosis(recordData.diagnosisName)}</p>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }

  _generatePatientRow(patients) {
    const row = patients.map((patient, idx) => {
      return this._renderPatientCard(patient, idx);
    });
    return row;
  }

  _generatePatientMatrix(patientsList) {
    if (patientsList.length !== 0) {
      const subArrays = this._segmentToChunk(patientsList, COLUMN_COUNT);
      const rows = subArrays.map((subArray) => this._generatePatientRow(subArray));
      return rows;
    }
  }

  render() {
    const { patients } = this.props;
    const { isReportOpen, selectedPatient } = this.state;
    return (
      <Container className="disable_scroll outerContainer">
        <Grid className="grid_ct" columns={COLUMN_COUNT}>
          {this._generatePatientMatrix(patients)}
        </Grid>
        {isReportOpen ?
          <IndividualReportPopup
            isOpen={ isReportOpen }
            popupInfo={ selectedPatient }
            onClose={ this.toggleModal }
          />
          : null
        }
      </Container>
    );
  }
}

export default PatientCardMatrix;