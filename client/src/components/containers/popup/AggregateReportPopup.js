import React, { Component } from "react";
import { Button, Header, Modal, Label, Container, Form } from "semantic-ui-react";
import { DateInput, YearInput } from "semantic-ui-calendar-react";
import { AggregateReportStatistics } from "components/containers/report";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
import "./AggregateReportPopup.css";

moment.locale("en");
const CATEGORY_ARR = ["I", "II", "III"];
const REPORT_CONST = {
  DIAGNOSIS_NAME: "diagnosisName",
  DIAGNOSIS_CATEGORY: "diagnosisCategory"
};

// Requires set of series and yAxis values
const defaultChartOptions = point => {
  return {
    chart: { type: "column" },
    title: { text: "" },
    subtitle: { text: "" },
    xAxis: { categories: ["PT", "PTRA", "OT", "OTRA", "SLP", "SLPA"], crosshair: true},
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: `<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.f} ${point}</b></td></tr>`,
      footerFormat: "</table>",
      shared: true,
      useHTML: true
    },
    plotOptions: { column: { pointPadding: 0.2, borderWidth: 0 } },
    credits: {
      enabled: false
    }
  };
}


class AggregateReportPopup extends Component {
  _isMounted = false;
  aggregateReportStatistics;

  constructor(props) {
    super(props);
    this.aggregateReportStatistics = new AggregateReportStatistics(this.props.categorySummary);
    this.state = {
      filterFisicalYear: moment().subtract(1, "year").format("YYYY"),
      filterFisicalYearError: false
    };

    this._renderAggregateSummaryHeader = this._renderAggregateSummaryHeader.bind(this);
    this._handleFilterDateChange = this._handleFilterDateChange.bind(this);
    this._renderStastics = this._renderStastics.bind(this);
    this._renderDateFilter = this._renderDateFilter.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    delete this.aggregateReportStatistics;
  }

  _print() {
    alert("Not yet implemented");
  }

  _handleFilterDateChange(event, { value }) {
    //TODO: if value is > then current year.
    const chosenDate = moment(value, "YYYY").format("YYYY");
    this.setState({
      filterFisicalYear: chosenDate,
    });
  }

  _returnDiagnosis(recordData, diagnosis) {
    return recordData[diagnosis].replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  _returnCategory(recordData, category) {
    return recordData[category];
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
    const { filterFisicalYear, filterFisicalYearError } = this.state;
    return(
      <Form.Field error={true}>
        <label>Select Fisical Year</label>
        <YearInput
          icon={false}
          className="date_pu"
          dateFormat="YYYY"
          name="date"
          placeholder="Date"
          value={ filterFisicalYear }
          onChange={ this._handleFilterDateChange }
        />
      </Form.Field>
    )
    // return(
    //   <div className="filterDateContainer">
    //     <div className="dateBox">
    //       <p className="filterDateInput">Start Date</p>
    //       <YearInput
    //         className="date_pu"
    //         dateFormat="YYYY"
    //         name="date"
    //         placeholder="Date"
    //         value={ filterFisicalYear }
    //         onChange={ this._handleFilterDateChange }
    //       />
    //     </div>
    //   </div>
    // );
  }

  _renderAggregateSummaryHeader() {
    const { selectedCategory } = this.props
    // TODO: better error handling.
    if (selectedCategory < 1) return (<div>NOOOOOO</div>);
    return (
        <p className="summaryHeader">{`Category ${CATEGORY_ARR[selectedCategory - 1]} Aggregate Report`}</p>
    );
  }

  _renderButtons() {
    return(
      <Modal.Actions>
        <Button primary  onClick={ this._print }>Print</Button>
        <Button  onClick={ this.props.onClose }>Close</Button>
      </Modal.Actions>
    )
  }

  _renderMedianTherapyIntensityHistogram({medianTherapyIntensityByDisciplines}) {
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
    const chartOptions = Object.assign({...defaultChartOptions("minutes")}, {...series}, {...yAxis});
    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
  }

  _renderMedianNumberOfAttendedByDisciplines({ medianNumberOfAttendedByDisciplines }) {
    const series = {
      series: [{
        showInLegend: false,
        data: [
          medianNumberOfAttendedByDisciplines[0], //PT
          medianNumberOfAttendedByDisciplines[1], //PTRA
          medianNumberOfAttendedByDisciplines[2], // OT
          medianNumberOfAttendedByDisciplines[3], // OTRA
          medianNumberOfAttendedByDisciplines[4], // SLP
          medianNumberOfAttendedByDisciplines[5]  // SLPA
        ]
      }]
    };

    const yAxis = { yAxis: { min: 0, tickInterval: 1, title: { text: "Number of Sessions" } } };
    const chartOptions = Object.assign({...defaultChartOptions("times")}, {...series}, {...yAxis});
    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
  }

  _renderMedianNumberOfMissedByDisciplines({ medianNumberOfMissedByDisciplines }) {
    const series = {
      series: [{
        showInLegend: false,
        data: [
          medianNumberOfMissedByDisciplines[0], //PT
          medianNumberOfMissedByDisciplines[1], //PTRA
          medianNumberOfMissedByDisciplines[2], // OT
          medianNumberOfMissedByDisciplines[3], // OTRA
          medianNumberOfMissedByDisciplines[4], // SLP
          medianNumberOfMissedByDisciplines[5]  // SLPA
        ]
      }]
    };
    const yAxis = { yAxis: { min: 0, tickInterval: 1, title: { text: "Number of Sessions" } } };
    const chartOptions = Object.assign({...defaultChartOptions("times")}, {...series}, {...yAxis});
    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
  }

  render() {
    const { filterFisicalYear } = this.state;
    const fisicalStartDate = moment(filterFisicalYear + "-01-01", "YYYY-MM-DD").format("YYYY-MM-DD");
    const fisicalEndDate = moment(filterFisicalYear + "-12-31", "YYYY-MM-DD").format("YYYY-MM-DD");
    const stats = this.aggregateReportStatistics.retrieveStatistics(fisicalStartDate, fisicalEndDate);

    return (
      <Modal onClose={ this.props.onClose } open={ this.props.isOpen } centered={false}>
        <Modal.Header className="header_ct aggregateHeader">

          <Container className="headerContainer">
            <div className="endToEnd">
              { this._renderAggregateSummaryHeader() }
              { this._renderDateFilter() }
            </div>
          </Container>
        </Modal.Header>

        <Modal.Content className="modalContentContainer" scrolling>
          <Modal.Description className="description_ct">
            <Container className="reportComponent">
              <Header className="descriptionHeader">Therapy Intensity Statistics</Header>
              { this._renderStastics(stats) }
            </Container>
            <Container className="reportComponent">
              <Header className="descriptionHeader">Median Therapy Intensity by Disciplines</Header>
              { this._renderMedianTherapyIntensityHistogram(stats) }
            </Container>

            <Container className="reportComponent">
              <Header className="descriptionHeader">Median Number of Sessions Attended by Disciplines</Header>
              { this._renderMedianNumberOfAttendedByDisciplines(stats) }
            </Container>

            <Container className="reportComponent">
              <Header className="descriptionHeader">Median Number of Sessions Missed by Disciplines</Header>
              { this._renderMedianNumberOfMissedByDisciplines(stats) }
            </Container>

          </Modal.Description>
        </Modal.Content>
        { this._renderButtons() }
      </Modal>
    );
  }
}

export default AggregateReportPopup;