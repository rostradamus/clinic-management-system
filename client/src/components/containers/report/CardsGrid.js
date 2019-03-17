import React, { Component } from "react";
import { Grid, Card, Label, Container } from "semantic-ui-react";
import { connect } from "react-redux";
import { ReportAction } from "actions";
import "./CardsGrid.css";

const reportStyle = {
  label: (idx) => ({ marginRight: "8px", marginTop: "3px", backgroundColor: reportStyle.colors[idx] }),
  colors: ["#2a9d8f", "#e9c46a", "#e76f51"]
};

class CardsGrid extends Component {
  // Create a single card
  _makePatientCard(patient) {
    return (
      <Card className="card_ct" onClick={this.props.openPopup}>
        <Card.Content onClick={() => this.props.setInfo(patient)}>
          <Card.Header className="header_ct">{patient.name}</Card.Header>
          <Card.Meta className="meta_ct">
            <span>{patient.patientId}</span>
          </Card.Meta>
          <Card.Description className="description_ct">
            <Label style={reportStyle.label(patient.diagnosis.type - 1)} empty circular key={"#0"} />
            <p style={{ fontWeight: "bold" }}>{patient.patientId}</p>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }

  // Creare a single row of 4 cards
  _makeRow(patients) {
    const row = patients.map((patient, idx) => {
      return this._makePatientCard(patient);
    });
    return row;
  }

  // Stack rows of patient cards
  _makeRows(patientsList) {
    const subArrays = _chunk(patientsList, 5);
    const rows = subArrays.map((subArray, idx) => {
      return this._makeRow(subArray);
    });
    return rows;

    // Helper for splitting 'array' into subsrrays with the length of 'size'
    function _chunk(array, size) {
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
  }

  // Filter based on search field
  _filterPatients(patients) {
    const { searchText } = this.props;
    const filteredlist = patients.filter((patient) => {
      return patient.name.toLowerCase().search(searchText.toLowerCase()) !== -1;
    });
    return filteredlist;
  }

  render() {
    const { patients } = this.props;
    return (
      <Container className="disable_scroll outerContainer">
        <Grid className="grid_ct" columns={5}>
          {this._makeRows(this._filterPatients(patients))}
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    searchText: state.report.searchText,
    patients: state.report.patients
  };
};

const mapDsipatchToProps = (dispatch) => ({
  setInfo: (userInfo) => dispatch(ReportAction.setInfoForPopup(userInfo)),
  openPopup: () => dispatch(ReportAction.openPopup()),
  resetSearchField: () => dispatch(ReportAction.setSearch("")),
  requestPatients: () => dispatch(ReportAction.getPatients())
});

export default connect(
  mapStateToProps,
  mapDsipatchToProps
)(CardsGrid);
