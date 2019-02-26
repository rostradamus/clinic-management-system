import React, { Component } from "react";
import { Grid, Card, Label } from "semantic-ui-react";
import { connect } from "react-redux";
import { ReportAction } from "actions";
import "./CardGrid.css";

const reportStyle = {
	outerContainer: { overflowX: "auto", overflowY: "hidden", width: "100%" },
	card: { maxWidth: "205px", minWidth: "205px", height: "120px", border: "2px solid #eeeeee", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.25)", cursor: "pointer" },
	type: { fontSize: "32px", color: "#000000" },
	grid: { marginTop: "30px", display: "flex" },
	header: { fontSize: "20px", fontWeight: "bold", color: "#000000" },
	meta: { fontSize: "14px", paddingTop: "10px" },
	description: { fontSize: "14px", paddingTop: "10px", display: "flex" },
	label: (idx) => ({ marginRight: "8px", marginTop: "3px", backgroundColor: reportStyle.colors[idx] }),
	colors: [ "#2a9d8f", "#e9c46a", "#e76f51" ]
};

class CardsGrid extends Component {
	// Create a single card
	_makePatientCard(patient) {
		return (
			<Grid.Column style={{ minWidth: "200px" }} key={patient.id} onClick={() => this.props.setInfo(patient)}>
				<Card style={reportStyle.card} onClick={this.props.openPopup}>
					<Card.Content>
						<Card.Header style={reportStyle.header}>{patient.name}</Card.Header>
						<Card.Meta style={reportStyle.meta}>
							<span>{patient.patientId}</span>
						</Card.Meta>
						<Card.Description style={reportStyle.description}>
							<Label style={reportStyle.label(patient.diagnosis.type - 1)} empty circular key={"#0"} />
							<p style={{ fontWeight: "bold" }}>{patient.diagnosis.name}</p>
						</Card.Description>
					</Card.Content>
				</Card>
			</Grid.Column>
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
		const subArrays = _chunk(patientsList, 4);
		const rows = subArrays.map((subArray, idx) => {
			return (
				<Grid.Row style={{ minWidth: "870px", maxWidth: "870px", height: "152px" }} columns={4} key={idx}>
					{this._makeRow(subArray)}
				</Grid.Row>
			);
		});
		return rows;

		// Helper for splitting 'array' into subsrrays with the length of 'size'
		function _chunk(array, size) {
			const chunked_arr = [];
			for (let i = 0; i < array.length; i++) {
				const last = chunked_arr[chunked_arr.length - 1];
				if (!last || last.length === size) {
					chunked_arr.push([ array[i] ]);
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
			<div style={reportStyle.outerContainer} className="disable_scroll">
				<Grid style={reportStyle.grid} columns={4}>
					{this._makeRows(this._filterPatients(patients))}
				</Grid>
			</div>
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
	openPopup: () => dispatch(ReportAction.openPopup())
});

export default connect(mapStateToProps, mapDsipatchToProps)(CardsGrid);
