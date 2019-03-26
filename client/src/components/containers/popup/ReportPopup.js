import React, { Component } from "react";
import { Button, Header, Icon, Image, Modal, Label, Container } from "semantic-ui-react";
import { DateInput } from "semantic-ui-calendar-react";
import { connect } from "react-redux";
import { ReportAction } from "actions";
import { helper } from "../report/helper";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import * as moment from "moment";
import "./ReportPopup.css";
moment.locale("en");

const REPORT_CONST = {
  DIAG_NAME: "diagnosisName",
  DIAG_CATEG: "diagnosisCategory",
  PRESENT: "PRESENT"
};

class ReportPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientId: "",
      startDate: "",
      endDate: "",
      adminDate: "0",
      dischargeDate: "0",
      average: 0,
      maximum: 0,
      minimum: 0,
      median: 0,
      mediansMin: [0, 0, 0, 0, 0, 0],
      numOfAttend: [0, 0, 0, 0, 0, 0],
      numOfMiss: [0, 0, 0, 0, 0, 0],
      appointments: []
    };
    this._renderStastics = this._renderStastics.bind(this);
  }

  // TODO: setState can be caught here
  static getDerivedStateFromProps(props, state) {
    if (props.popupInfo.recordDatas && props.popupInfo.patientId !== state.patientId) {
      const adminDate = moment(props.popupInfo.recordDatas[0].admissionDate).format("L");
      const isDate = props.popupInfo.recordDatas[0].dischargeDate;
      const dischargeDate = isDate !== null ? moment(isDate).format("L") : moment().format("L");
      const allAppointments = props.popupInfo.recordDatas[0].appointments;
      const stats = helper._getStats(adminDate, dischargeDate, allAppointments);
      const statsDiscipline = helper._getStatsForDiscplines(adminDate, dischargeDate, allAppointments);

      return {
        patientId: props.popupInfo.patientId,
        startDate: adminDate,
        endDate: dischargeDate,
        adminDate: adminDate,
        dischargeDate: dischargeDate,
        average: stats.average,
        maximum: stats.maximum,
        minimum: stats.minimum,
        median: stats.median,
        mediansMin: statsDiscipline.mediansMin,
        numOfAttend: statsDiscipline.numOfAttend,
        numOfMiss: statsDiscipline.numOfMiss,
        appointments: allAppointments
      };
    }
    return {};
  }

  _print() {
    alert("Not yet implemented");
  }

  _handleStartDateChange(event, { value }) {
    const chosenDate = moment(value, "MM-DD-YYYY")._i;
    const allAppointments = this.props.popupInfo.recordDatas[0].appointments;

    const stats = helper._getStats(chosenDate, this.state.endDate, allAppointments);
    const statsDiscipline = helper._getStatsForDiscplines(chosenDate, this.state.endDate, allAppointments);

    this.setState({
      startDate: chosenDate,
      average: stats.average,
      maximum: stats.maximum,
      minimum: stats.minimum,
      median: stats.median,
      mediansMin: statsDiscipline.mediansMin,
      numOfAttend: statsDiscipline.numOfAttend,
      numOfMiss: statsDiscipline.numOfMiss,
      appointments: allAppointments
    });
  }

  _handleEndDateChange(event, { value }) {
    const chosenDate = moment(value, "MM-DD-YYYY")._i;
    const allAppointments = this.props.popupInfo.recordDatas[0].appointments;

    const stats = helper._getStats(this.state.startDate, chosenDate, allAppointments);
    const statsDiscipline = helper._getStatsForDiscplines(this.state.startDate, chosenDate, allAppointments);

    this.setState({
      endDate: chosenDate,
      average: stats.average,
      maximum: stats.maximum,
      minimum: stats.minimum,
      median: stats.median,
      mediansMin: statsDiscipline.mediansMin,
      numOfAttend: statsDiscipline.numOfAttend,
      numOfMiss: statsDiscipline.numOfMiss,
      appointments: allAppointments
    });
  }

  _returnAdmissionDate() {
    const { popupInfo } = this.props;
    return !helper._checkUndefined(popupInfo.recordDatas) ? popupInfo.recordDatas[0] : "Not Identified";
  }

  // TEMP SOLUTION
  _createDiagnosisTitle(str) {
    let title = str;

    if (str.length > 0) {
      title = str.charAt(0).toUpperCase() + str.slice(1);
    }

    return title;
  }

  // TODO: actually do not konw how popupInfo can be undefiend
  _returnDiagnosis(diagnosis) {
    const { popupInfo } = this.props;

    if (!helper._checkUndefined(popupInfo.recordDatas)) {
      return this._createDiagnosisTitle(popupInfo.recordDatas[0][diagnosis]);
    }

    return "Not Identified";
  }

  // TODO: actually do not konw how popupInfo can be undefined
  _returnCategory(category) {
    const { popupInfo } = this.props;
    return !helper._checkUndefined(popupInfo.recordDatas) ? popupInfo.recordDatas[0][category] : "Not Identified";
  }

  // TODO: actually do not konw how popupInfo can be undefiend
  _returnStats(type) {
    const { popupInfo } = this.props;
    return !helper._checkUndefined(popupInfo.totalIntensity) ? popupInfo.totalIntensity[0][type] : "Not Identified";
  }

  _renderStastics() {
    const { average, median, maximum, minimum } = this.state;
    return(
      <Container centered="true" className="statContainer">
        <Container className="stat">
          <p className="statValue">{ average }</p>
          <p>Average</p>
        </Container>
        <Container className="stat">
          <p className="statValue">{ median } </p>
          <p>Median</p>
        </Container>
        <Container className="stat">
          <p className="statValue">{ maximum }</p>
          <p>Maximum</p>
        </Container>
        <Container className="stat">
          <p className="statValue">{ minimum }</p>
          <p>Minimum</p>
        </Container>
      </Container>
    );
  }

  render() {
    const { popupInfo } = this.props;
    const { endDate, startDate, adminDate, dischargeDate } = this.state;
    const minDate = moment(adminDate).format("L");
    // const maxDate = moment(dischargeDate).format("L");

    const AdminDisDates = (
      <div className="dataContainer">
        <div className="dateBox">
          <p className="admDis">Start Date</p>
          <DateInput
            className="date_pu"
            dateFormat="MM-DD-YYYY"
            name="date"
            placeholder="Date"
            minDate={minDate}
            value={moment(startDate).format("L")}
            onChange={(e, data) => this._handleStartDateChange(e, data)}
          />
        </div>
        <Label className="separator">&mdash;</Label>
        <div className="dateBox">
          <p className="admDis">End Date</p>
          <DateInput
            className="date_pu"
            dateFormat="MM-DD-YYYY"
            name="date"
            placeholder="Date"
            value={moment(endDate).format("L")}
            onChange={(e, data) => this._handleEndDateChange(e, data)}
          />
        </div>
      </div>
    );

    const PatientDetail = (
      <div>
        <p className="patient_detail">{popupInfo.patientId}</p>
        <p className="patient_detail">{this._returnCategory(REPORT_CONST.DIAG_CATEG)}</p>
        <p className="patient_detail">{this._returnDiagnosis(REPORT_CONST.DIAG_NAME)}</p>
      </div>
    );

    const chartOptions = {
      chart: {
        type: "column"
      },
      title: {
        text: ""
      },
      subtitle: {
        text: ""
      },
      xAxis: {
        categories: ["PT", "PTRA", "OT", "OTRA", "SLP", "SLPA"],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: "Minutes"
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.f} min</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          name: "Therapy Intensity in Median Minutes",
          showInLegend: false,
          data: [
            this.state.mediansMin[0],
            this.state.mediansMin[1],
            this.state.mediansMin[2],
            this.state.mediansMin[3],
            this.state.mediansMin[4],
            this.state.mediansMin[5]
          ]
        }
      ],
      credits: {
        enabled: false
      }
    };

    const Histogram = <HighchartsReact highcharts={Highcharts} options={chartOptions} />;

    const chartOptionsForAttend = {
      chart: {
        type: "column"
      },
      title: {
        text: ""
      },
      subtitle: {
        text: ""
      },
      xAxis: {
        categories: ["PT", "PTRA", "OT", "OTRA", "SLP", "SLPA"],
        crosshair: true
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: "Number of Sessions"
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.f} times</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          showInLegend: false,
          data: [
            this.state.numOfAttend[0],
            this.state.numOfAttend[1],
            this.state.numOfAttend[2],
            this.state.numOfAttend[3],
            this.state.numOfAttend[4],
            this.state.numOfAttend[5]
          ]
        }
      ],
      credits: {
        enabled: false
      }
    };

    const attendHistogram = <HighchartsReact highcharts={Highcharts} options={chartOptionsForAttend} />;

    const chartOptionsForMiss = {
      chart: {
        type: "column"
      },
      title: {
        text: ""
      },
      subtitle: {
        text: ""
      },
      xAxis: {
        categories: ["PT", "PTRA", "OT", "OTRA", "SLP", "SLPA"],
        crosshair: true
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: "Number of Sessions"
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.f} times</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          showInLegend: false,
          data: [
            this.state.numOfMiss[0],
            this.state.numOfMiss[1],
            this.state.numOfMiss[2],
            this.state.numOfMiss[3],
            this.state.numOfMiss[4],
            this.state.numOfMiss[5]
          ]
        }
      ],
      credits: {
        enabled: false
      }
    };

    const missHistogram = <HighchartsReact highcharts={Highcharts} options={chartOptionsForMiss} />;

    const Buttons = (
      <Modal.Actions>
        <Button primary className="btn_pu" onClick={this._print}>
          Print
        </Button>
        <Button className="btn_pu" onClick={this.props.closePopup}>
          Close
        </Button>
      </Modal.Actions>
    );

    return (
      <Modal open={this.props.openPopup} centered={false}>
        <Modal.Header className="header_ct">
          <p className="name">{popupInfo.patientName}</p>
          <Container className="headerContainer">
            <div className="patientInfo">
              <p className="details">MRN</p>
              <p className="details">Category</p>
              <p className="details">Diagnosis</p>
            </div>
            <div className="endToEnd">
              {PatientDetail}
              {AdminDisDates}
            </div>
          </Container>
        </Modal.Header>
        <Modal.Content className="contentContainer" scrolling>
          <Modal.Description className="description_ct">
            <Container className="reportComponent">
              <Header className="descriptionHeader">Therapy Intensity Statistics</Header>
              {this._renderStastics()}
            </Container>
            <Container className="reportComponent">
              <Header className="descriptionHeader">Therapy Intensity Statistics by Disciplines</Header>
              {Histogram}
            </Container>
            <Container className="reportComponent">
              <Header className="descriptionHeader">Number of Sessions Attended by Disciplines</Header>
              {attendHistogram}
            </Container>
            <Container className="reportComponent">
              <Header className="descriptionHeader">Number of Sessions Missed by Disciplines</Header>
              {missHistogram}
            </Container>
          </Modal.Description>
        </Modal.Content>
        {Buttons}
      </Modal>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  closePopup: () => dispatch(ReportAction.closePopup())
});

const mapStateToProp = (state) => ({
  openPopup: state.report.openPopup,
  popupInfo: state.report.popupInfo
});

export default connect(
  mapStateToProp,
  mapDispatchToProps
)(ReportPopup);
