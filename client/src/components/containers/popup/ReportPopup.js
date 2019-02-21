import React, { Component } from "react";
import { Button, Header, Icon, Image, Modal, Label } from "semantic-ui-react";
import { connect } from "react-redux";
import { ReportAction } from "actions";

const popupStyle = {
	header: { marginLeft: "35px", marginRight: "35px", paddingBottom: "0px" },
	headerContainer: { display: "flex" },
	name: { fontSize: "44px", fontWeight: "bold", marginBottom: "15px" },
	details: { width: "100px", fontSize: "15px", color: "#696969", margin: "0px", marginBottom: "10px", fontWeight: "600" },
	details2: { fontSize: "15px", marginBottom: "10px", fontWeight: "600", color: "#383838" },
	date: { width: "110px", height: "35px", borderRadius: "8px", backgroundColor: "#aaba32", textAlign: "center", color: "#fefefe", fontSize: "15px", fontWeight: "500" },
	admDis: { fontSize: "12px", color: "#696969", margin: "3px", marginLeft: "5px" },
	dataContainer: { display: "flex", alignItems: "center", marginRight: "-31.5px", marginBottom: "-12px" },
	separator: { backgroundColor: "#ffffff", paddingTop: "30px" },
	endToEnd: { width: "100%", display: "flex", justifyContent: "space-between" },
	contentContainer: { height: "400px", paddingLeft: "35px", paddingRight: "35px" },
	content: { display: "flex", flexDirection: "column", width: "100%" },
	descriptionHeader: { fontSize: "22px", fontWeight: "300", margin: "0px" },
	stat: { display: "flex", flexDirection: "column", alignItems: "center" },
	statValue: { fontSize: "75px", marginBottom: "0px", fontWeight: "300", color: "#0077B5" },
	statContainer: { display: "flex", justifyContent: "space-evenly", width: "100%", marginBottom: "30px" },
	image: { marginTop: "40px" }
};

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
				<Modal.Header style={popupStyle.header}>
					<p style={popupStyle.name}>{popupInfo.name}</p>
					<div style={popupStyle.headerContainer}>
						<div>
							<p style={popupStyle.details}>MRN</p>
							<p style={popupStyle.details}>Diagnosis</p>
							<p style={popupStyle.details}>Category</p>
						</div>
						<div style={popupStyle.endToEnd}>
							<div>
								<p style={popupStyle.details2}>{popupInfo.patientId}</p>
								<p style={popupStyle.details2}>{this._returnDiagnosis("name")}</p>
								<p style={popupStyle.details2}>{this._returnDiagnosis("type")}</p>
							</div>
							<div style={popupStyle.dataContainer}>
								<div>
									<p style={popupStyle.admDis}>Admission Date</p>
									<Label style={popupStyle.date}>{popupInfo.admissionDate}</Label>
								</div>
								<div>
									<Label style={popupStyle.separator}>&mdash;</Label>
								</div>
								<div>
									<p style={popupStyle.admDis}>Discarge Date</p>
									<Label style={popupStyle.date}>{popupInfo.dischargeDate}</Label>
								</div>
							</div>
						</div>
					</div>
				</Modal.Header>
				<Modal.Content style={popupStyle.contentContainer} image scrolling>
					<div style={popupStyle.content}>
						<Modal.Description centered="true">
							<Header style={popupStyle.descriptionHeader}>Therapy Intensity Statistics(mins)</Header>
							<div style={popupStyle.statContainer}>
								<div style={popupStyle.stat}>
									<p style={popupStyle.statValue}>{this._returnStats("average")}</p>
									<p>Average</p>
								</div>
								<div style={popupStyle.stat}>
									<p style={popupStyle.statValue}>{this._returnStats("median")} </p>
									<p>Medium</p>
								</div>
								<div style={popupStyle.stat}>
									<p style={popupStyle.statValue}>{this._returnStats("max")}</p>
									<p>Maximum</p>
								</div>
								<div style={popupStyle.stat}>
									<p style={popupStyle.statValue}>{this._returnStats("min")}</p>
									<p>Minimum</p>
								</div>
							</div>
							<Header style={popupStyle.descriptionHeader}>Therapy Intensity Statistics by Disciplines(mins)</Header>
						</Modal.Description>
						<Image style={popupStyle.image} centered size="medium" src="https://react.semantic-ui.com/images/wireframe/image.png" wrapped />
					</div>
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

export default connect(mapStateToProp, mapDispatchToProps)(ReportPopup);
