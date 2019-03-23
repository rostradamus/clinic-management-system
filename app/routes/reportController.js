const routes = require('express').Router();
const reportManager = require("@app/helpers/queryManager/report");
const moment = require('moment');

// Helper functions
function validateAppointmentDate(admisisonDate, dischargeDate, startDate, endDate) {
    if (!dischargeDate) {
        return moment(startDate).isSameOrAfter(admisisonDate);
    } else {
        return (moment(startDate).isSameOrAfter(admisisonDate)) && (moment(endDate).isSameOrBefore(dischargeDate));
    }
}

function groupByPatient(appointmentList) {
    let result = [];
    appointmentList.forEach((item) => {            
        if (!result.some(p => p.patientName === item.patient_name)) {
            let patient = {};
            patient.patientName = item.patient_name;
            patient.patientId = item.mrn;
            patient.recordDatas = [];
            result.push(patient);
        }

        let recordDatas = result.find(p => p.patientName === item.patient_name).recordDatas;

        if (!recordDatas.some(r => r.recordId === item.record_id)) {
            let recordData = {};
            recordData.recordId = item.record_id;
            recordData.admissionDate = item.admission_date;
            recordData.dischargeDate = item.discharge_date;
            recordData.diagnosisName = item.type_of_injury;
            recordData.diagnosisCategory = item.patient_category;
            recordData.appointments = [];
            recordDatas.push(recordData);
        }

        let appointments = recordDatas.find(r => r.recordId === item.record_id).appointments;

        let appointment = {};

        if (validateAppointmentDate(item.admission_date, item.discharge_date, item.start_date, item.end_date)) {
            appointment.appointmentId = item.appointment_id;
            appointment.startDate = item.start_date;
            appointment.endDate = item.end_date;
            appointment.duration = item.duration;
            appointments.push(appointment);
        } 
    });

    return result;
}

routes.get("/", async (req, res) => {
    try {
        const appointmentList = await reportManager.getAllAppointmentsWithPatientAndAdmissionRecordInfo();
        const reports = groupByPatient(appointmentList);

        res.status(200);
        res.send(reports);
    } catch (err) {
        res.status(500);
        console.log(err);
    }
});

routes.get("/:user_id", async (req, res) => {
    try {
        const patientInfo = await reportManager.getPatientInfoFromUserId(req.params.user_id);

        if (!patientInfo || patientInfo.length === 0) {
            res.status(404)
                .json({ message: `Patient with id = ${req.params.user_id} does NOT exist`});
        }

        const appointmentList = await reportManager.getAppointmentsWithRecordId(patientInfo[0].current_admission_record);

        let result = {};
        result.patientName = patientInfo[0].patient_name;
        result.patientId = patientInfo[0].mrn;
        result.currentRecord = patientInfo[0].current_admission_record;
        result.appointments = [];

        appointmentList.forEach((item) => {
            let appointment = {};
            appointment.appointmentId = item.appointment_id;
            appointment.startDate = item.start_date;
            appointment.endDate = item.end_date;
            appointment.duration = item.duration;

            result.appointments.push(appointment);
        });

        res.status(200);
        res.send(result);
    } catch (err) {
        res.status(500);
        console.log(err);
    }
});

module.exports = routes;