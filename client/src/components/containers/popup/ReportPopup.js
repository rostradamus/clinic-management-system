import React, { Component } from "react";
import { Button, Header, Icon, Image, Modal, Label, Container } from "semantic-ui-react";
import { connect } from "react-redux";
import { ReportAction } from "actions";
import "./ReportPopup.css";

class ReportPopup extends Component {
  _print() {
    alert("Not yet implemented");
  }

  // TODO: actually do not konw how popupInfo can be undefiend
  _returnDiagnosis(nameOrType) {
    const { popupInfo } = this.props;
    return typeof popupInfo.diagnosis !== "undefined" ? popupInfo.diagnosis[nameOrType] : "Not Identified";
  }

  // TODO: actually do not konw how popupInfo can be undefiend
  _returnStats(type) {
    const { popupInfo } = this.props;
    return typeof popupInfo.totalIntensity !== "undefined" ? popupInfo.totalIntensity[type] : "Not Identified";
  }

  render() {
    const { popupInfo } = this.props;
    return (
      <Modal open={this.props.openPopup} dimmer={true}>
        <Modal.Header className="header_ct">
          <p className="name">{popupInfo.name}</p>
          <Container className="headerContainer">
            <div className="patientInfo">
              <p className="details">MRN</p>
              <p className="details">Diagnosis</p>
              <p className="details">Category</p>
            </div>
            <div className="endToEnd">
              <div>
                <p className="details2">{popupInfo.patientId}</p>
                <p className="details2">{this._returnDiagnosis("name")}</p>
                <p className="details2">{this._returnDiagnosis("type")}</p>
              </div>
              <div className="dataContainer">
                <div className="dateBox">
                  <p className="admDis">Admission Date</p>
                  <Label className="date">{popupInfo.admissionDate}</Label>
                </div>
                <Label className="separator">&mdash;</Label>
                <div>
                  <p className="admDis">Discarge Date</p>
                  <Label className="date">{popupInfo.dischargeDate}</Label>
                </div>
              </div>
            </div>
          </Container>
        </Modal.Header>
        <Modal.Content className="contentContainer" scrolling>
          <Container className="content">
            <Modal.Description className="description_ct">
              <Header className="descriptionHeader">Therapy Intensity Statistics(mins)</Header>
              <Container centered className="statContainer">
                <Container className="stat">
                  <p className="statValue">{this._returnStats("average")}</p>
                  <p>Average</p>
                </Container>
                <Container className="stat">
                  <p className="statValue">{this._returnStats("median")} </p>
                  <p>Medium</p>
                </Container>
                <Container className="stat">
                  <p className="statValue">{this._returnStats("max")}</p>
                  <p>Maximum</p>
                </Container>
                <Container className="stat">
                  <p className="statValue">{this._returnStats("min")}</p>
                  <p>Minimum</p>
                </Container>
              </Container>
              <Header className="descriptionHeader">Therapy Intensity Statistics by Disciplines(mins)</Header>
            </Modal.Description>
            <Image className="image_ct" centered size="medium" src="https://react.semantic-ui.com/images/wireframe/image.png" wrapped />
          </Container>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.props.closePopup}>
            Close <Icon name="chevron right" />
          </Button>
          <Button primary onClick={this._print}>
            Print <Icon name="chevron right" />
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  closePopup: () => dispatch(ReportAction.closePopup())
});

const mapStateToProp = (state) => ({
  patientForPopup: state.report.popupInfo,
  openPopup: state.report.openPopup,
  popupInfo: state.report.popupInfo
});

export default connect(
  mapStateToProp,
  mapDispatchToProps
)(ReportPopup);
