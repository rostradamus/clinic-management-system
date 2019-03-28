import React, { Component } from "react";
import { Button, Header, Modal, Label, Container, Form, Grid, Divider } from "semantic-ui-react";
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
      filterFisicalYear: moment().format("YYYY")
    };

    this._handleFilterDateChange = this._handleFilterDateChange.bind(this);
    this._renderAggregateSummaryHeader = this._renderAggregateSummaryHeader.bind(this);
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
    const chosenDate = moment(value, "YYYY");
    this.setState({
      filterFisicalYear: chosenDate.format("YYYY"),
    });
  }

  _returnDiagnosis(recordData, diagnosis) {
    return recordData[diagnosis].replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  _renderButtons() {
    return(
      <Modal.Actions>
        <Button primary onClick={ this._print }>Print</Button>
        <Button  onClick={ this.props.onClose }>Close</Button>
      </Modal.Actions>
    )
  }

  _renderDateFilter() {
    const { filterFisicalYear } = this.state;
    return(
      <Form className="aggReportFormContainer">
        <Form.Field className="aggReportFormField">
          <label className="aggReportFilterLabel">Select Fisical Year</label>
          <YearInput
            className="aggReportYearInput"
            icon={false}
            dateFormat="YYYY"
            name="date"
            value={ filterFisicalYear }
            onChange={ this._handleFilterDateChange }
          />
        </Form.Field>
      </Form>
    );
  }

  _renderAggregateSummaryHeader() {
    const { selectedCategory } = this.props
    // TODO: better error handling.
    if (selectedCategory < 1) return (<div>NOOOOOO</div>);
    return (
      <Header as='h1' className="summaryHeader">
        {`Category ${CATEGORY_ARR[selectedCategory - 1]} Aggregate Report`}
      </Header>
    );
  }

  _renderStastics(stats) {
    return(
      <Container className="aggReportContentContainer">
        <Header className="aggReportModalContentHeader">Therapy Intensity Statistics</Header>
        <Grid className="aggStatisticContainer">
          <Grid.Row className="aggStatisticRow">
            <Grid.Column width={4} className="aggStatisticColumn">
              <p className="aggStatisticValue">{ stats.totalAverage }</p>
              <p className="aggStatisticDescription">Average</p>
            </Grid.Column>

            <Grid.Column width={4} className="aggStatisticColumn">
              <p className="aggStatisticValue">{ stats.totalMedian } </p>
              <p className="aggStatisticDescription">Median</p>
            </Grid.Column>

            <Grid.Column width={4} className="aggStatisticColumn">
              <p className="aggStatisticValue">{ stats.totalMaximum }</p>
              <p className="aggStatisticDescription">Maximum</p>
            </Grid.Column>

            <Grid.Column width={4} className="aggStatisticColumn">
              <p className="aggStatisticValue">{ stats.totalMinimum }</p>
              <p className="aggStatisticDescription">Minimum</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
      </Container>
    );
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

    return (
      <Container className="aggReportContentContainer">
        <Header className="aggReportModalContentHeader">Median Therapy Intensity by Disciplines</Header>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        <Divider />
      </Container>
    );
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

    return (
      <Container className="aggReportContentContainer">
        <Header className="aggReportModalContentHeader">Median Number of Sessions Attended by Disciplines</Header>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        <Divider />
      </Container>
    );
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
    return (
      <Container className="aggReportContentContainer">
        <Header className="aggReportModalContentHeader">Median Number of Sessions Missed by Disciplines</Header>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Container>
    );
  }

  render() {
    const { filterFisicalYear } = this.state;
    const fisicalStartDate = moment(filterFisicalYear + "-01-01", "YYYY-MM-DD").format("YYYY-MM-DD");
    const fisicalEndDate = moment(filterFisicalYear + "-12-31", "YYYY-MM-DD").format("YYYY-MM-DD");
    const stats = this.aggregateReportStatistics.retrieveStatistics(fisicalStartDate, fisicalEndDate);

    return (
      <Modal onClose={ this.props.onClose } open={ this.props.isOpen } centered={false}>
        <Modal.Header className={"a"/**"header_ct aggregateHeader"*/}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={13}>
                { this._renderAggregateSummaryHeader() }
              </Grid.Column>

              <Grid.Column width={3}>
                { this._renderDateFilter() }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Header>

        <Modal.Content className="aggModalContentContainer" scrolling>
          { this._renderStastics(stats) }
          { this._renderMedianTherapyIntensityHistogram(stats) }
          { this._renderMedianNumberOfAttendedByDisciplines(stats) }
          { this._renderMedianNumberOfMissedByDisciplines(stats) }
        </Modal.Content>
        { this._renderButtons() }
      </Modal>
    );
  }
}

export default AggregateReportPopup;