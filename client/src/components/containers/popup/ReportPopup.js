import React, { Component } from "react";
import { Button, Header, Modal, Label, Container } from "semantic-ui-react";
import { DateInput } from "semantic-ui-calendar-react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { ReportAction } from "actions";
import { helper } from "../report/helper";
import IndividualReportStatistics from "../report/IndividualReportStatistics";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
import "./ReportPopup.css";
moment.locale("en");

const REPORT_CONST = {
  DIAG_NAME: "diagnosisName",
  DIAG_CATEG: "diagnosisCategory",
  PRESENT: "PRESENT"
};

// Requires set of series and yAxis values
const defaultChartOptions = {
  chart: { type: "column" },
  title: { text: "" },
  subtitle: { text: "" },
  xAxis: { categories: ["PT", "PTRA", "OT", "OTRA", "SLP", "SLPA"], crosshair: true},
  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.f} times</b></td></tr>',
    footerFormat: "</table>",
    shared: true,
    useHTML: true
  },
  plotOptions: { column: { pointPadding: 0.2, borderWidth: 0 } },
  credits: {
    enabled: false
  }
};

class ReportPopup extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    const recordData = props.popupInfo.recordDatas[0];
    const filterEndDate = recordData.dischargeDate ?
        moment(recordData.dischargeDate, "YYYY-MM-DD").format("YYYY-MM-DD") :
        moment().format("YYYY-MM-DD");

    this.individualReportStatistics = new IndividualReportStatistics(recordData.appointments);

    this.state = {
      filterStartDate: moment(recordData.admissionDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
      filterEndDate
    };

    this._handleFilterDateChange = this._handleFilterDateChange.bind(this);
    this._renderStastics = this._renderStastics.bind(this);
    this._renderDateFilter = this._renderDateFilter.bind(this);
    this._renderButtons = this._renderButtons.bind(this);
    this._renderTherapyIntensityHistogram = this._renderTherapyIntensityHistogram.bind(this);
    this._renderDidAttendHistogram = this._renderDidAttendHistogram.bind(this);
    this._renderDidNotAttendHistogram = this._renderDidNotAttendHistogram.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    delete this.individualReportStatistics;
  }

  _print() {
    alert("Not yet implemented");
  }

  _handleFilterDateChange(event, { value }, key) {
    const chosenDate = moment(value, "YYYY-MM-DD").format("YYYY-MM-DD");
    this.setState({
      [key]: chosenDate,
    });
  }

  _returnAdmissionDate() {
    const { popupInfo } = this.props;
    return !helper._checkUndefined(popupInfo.recordDatas) ? popupInfo.recordDatas[0] : "Not Identified";
  }

  _returnDiagnosis(recordData, diagnosis) {
    return recordData[diagnosis].replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  _returnCategory(recordData, category) {
    return recordData[category];
  }

  // TODO: actually do not konw how popupInfo can be undefiend
  _returnStats(type) {
    const { popupInfo } = this.props;
    return !helper._checkUndefined(popupInfo.totalIntensity) ? popupInfo.totalIntensity[0][type] : "Not Identified";
  }

  _renderStastics(stats) {
    return(
      <Container centered="true" className="statContainer">
        <Container className="stat">
          <p className="statValue">{ stats.totalAverage }</p>
          <p>Average</p>
        </Container>
        <Container className="stat">
          <p className="statValue">{ stats.totalMedian } </p>
          <p>Median</p>
        </Container>
        <Container className="stat">
          <p className="statValue">{ stats.totalMaximum }</p>
          <p>Maximum</p>
        </Container>
        <Container className="stat">
          <p className="statValue">{ stats.totalMinimum }</p>
          <p>Minimum</p>
        </Container>
      </Container>
    );
  }

  _renderDateFilter() {
    const { filterEndDate, filterStartDate } = this.state;
    const { admissionDate } = this.props.popupInfo.recordDatas[0];

    return(
      <div className="dataContainer">
        <div className="dateBox">
          <p className="admDis">Start Date</p>
          <DateInput
            className="date_pu"
            dateFormat="YYYY-MM-DD"
            name="date"
            placeholder="Date"
            minDate={ moment(admissionDate, "YYYY-MM-DD").format("L") }
            value={ moment(filterStartDate, "YYYY-MM-DD").format("L") }
            onChange={(e, data) => this._handleFilterDateChange(e, data, "filterStartDate") }
          />
        </div>
        <Label className="separator">&mdash;</Label>
        <div className="dateBox">
          <p className="admDis">End Date</p>
          <DateInput
            className="date_pu"
            dateFormat="YYYY-MM-DD"
            name="date"
            placeholder="Date"
            value={ moment(filterEndDate).format("L") }
            onChange={(e, data) => this._handleFilterDateChange(e, data) }
          />
        </div>
      </div>
    );
  }

  _renderPatientDetail(popupInfo) {
    const recordData = popupInfo.recordDatas[0];
    return(
      <div>
        <p className="patient_detail">{popupInfo.patientId}</p>
        <p className="patient_detail">
          {this._returnCategory(recordData, REPORT_CONST.DIAG_CATEG)}
        </p>
        <p className="patient_detail">
          { this._returnDiagnosis(recordData, REPORT_CONST.DIAG_NAME) }
        </p>
      </div>
    )
  }

  _renderButtons() {
    return(
      <Modal.Actions>
        <Button primary className="btn_pu" onClick={this._print}>Print</Button>
        <Button className="btn_pu" onClick={this.props.closePopup}>Close</Button>
      </Modal.Actions>
    )
  }

  _renderTherapyIntensityHistogram({medianTherapyIntensityByDisciplines}) {
    const series = {
      series: [{
        showInLegend: false,
        data: [
          medianTherapyIntensityByDisciplines[0], //PT
          medianTherapyIntensityByDisciplines[1], //PTRA
          medianTherapyIntensityByDisciplines[2], // OT
          medianTherapyIntensityByDisciplines[3], // OTRA
          medianTherapyIntensityByDisciplines[4], // SLP
          medianTherapyIntensityByDisciplines[5]  // SLPA
        ]
      }]
    };
    const yAxis = { yAxis: { min: 0, title: { text: "Minutes" } } };
    const chartOptions = Object.assign({...defaultChartOptions}, {...series}, {...yAxis});
    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
  }

  _renderDidAttendHistogram({ numberOfAttendedByDisciplines }) {
    const series = {
      series: [{
        showInLegend: false,
        data: [
          numberOfAttendedByDisciplines[0], //PT
          numberOfAttendedByDisciplines[1], //PTRA
          numberOfAttendedByDisciplines[2], // OT
          numberOfAttendedByDisciplines[3], // OTRA
          numberOfAttendedByDisciplines[4], // SLP
          numberOfAttendedByDisciplines[5]  // SLPA
        ]
      }]
    };

    const yAxis = { yAxis: { min: 0, tickInterval: 1, title: { text: "Number of Sessions" } } };
    const chartOptions = Object.assign({...defaultChartOptions}, {...series}, {...yAxis});
    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
  }

  _renderDidNotAttendHistogram({ numberOfMissedByDisciplines }) {
    const series = {
      series: [{
        showInLegend: false,
        data: [
          numberOfMissedByDisciplines[0], //PT
          numberOfMissedByDisciplines[1], //PTRA
          numberOfMissedByDisciplines[2], // OT
          numberOfMissedByDisciplines[3], // OTRA
          numberOfMissedByDisciplines[4], // SLP
          numberOfMissedByDisciplines[5]  // SLPA
        ]
      }]
    };
    const yAxis = { yAxis: { min: 0, tickInterval: 1, title: { text: "Number of Sessions" } } };
    const chartOptions = Object.assign({...defaultChartOptions}, {...series}, {...yAxis});
    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
  }

  render() {
    const { popupInfo, openPopup } = this.props;
    const recordData = popupInfo.recordDatas[0] || {};
    const appointments = recordData.appointments || [];
    const { filterStartDate, filterEndDate } = this.state;
    const stats = this.individualReportStatistics.retrieveStatistics(filterStartDate, filterEndDate);

    return (
      <Modal open={openPopup} centered={false}>
        <Modal.Header className="header_ct">
          <p className="name">{popupInfo.patientName}</p>
          <Container className="headerContainer">
            <div className="patientInfo">
              <p className="details">MRN</p>
              <p className="details">Category</p>
              <p className="details">Diagnosis</p>
            </div>
            <div className="endToEnd">
              { this._renderPatientDetail(popupInfo) }
              { this._renderDateFilter() }
            </div>
          </Container>
        </Modal.Header>

        <Modal.Content className="contentContainer" scrolling>
          <Modal.Description className="description_ct">
            <Container className="reportComponent">
              <Header className="descriptionHeader">Therapy Intensity Statistics</Header>
              { this._renderStastics(stats) }
            </Container>
            <Container className="reportComponent">
              { this._renderTherapyIntensityHistogram(stats) }
            </Container>
            <Container className="reportComponent">
              <Header className="descriptionHeader">Number of Sessions Attended by Disciplines</Header>
              { this._renderDidAttendHistogram(stats) }
            </Container>
            <Container className="reportComponent">
              <Header className="descriptionHeader">Number of Sessions Missed by Disciplines</Header>
              { this._renderDidNotAttendHistogram(stats) }
            </Container>
          </Modal.Description>
        </Modal.Content>
        { this._renderButtons() }
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    closePopup: ReportAction.closePopup
  }, dispatch);
}

export default connect(null , mapDispatchToProps)(ReportPopup);
