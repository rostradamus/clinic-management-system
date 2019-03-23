const nodemailer = require("nodemailer");
const ical = require('ical-generator');
let transporter;
// will remove later when moment become a global variable
const moment = require('moment');
require('moment-timezone');

let getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASSWORD
      }
    });
  }
  return transporter;
}

let generateMailOptionsForNewAppointment = function(appointment, patientUser, staffUser) {
  let event = iCalAttachmentGenerator(appointment, patientUser);
  return {
    from: process.env.NODE_MAILER_PASSWORD,
    // to: staffUser.email,
    to: "m.yoon@sap.com",
    subject: `New appointment with ${patientUser.first_name} ${patientUser.last_name}`,
    text: `You have an upcoming appointment with ${patientUser.first_name} ${patientUser.last_name} \n To save this event in your calendar you must do this: \n 1. Open the ics attachment \n 2. Click 'Save & close'`,
    icalEvent: event
  }
}

let generateMailOptionsForUpdateAppointment = function(appointment, patientUser, staffUser) {
  let event = iCalAttachmentGenerator(appointment, patientUser);
  return {
    from: process.env.NODE_MAILER_PASSWORD,
    // to: staffUser.email,
    to: "m.yoon@sap.com",
    subject: `Updated appointment with ${patientUser.first_name} ${patientUser.last_name}`,
    text: `The appointment with ${patientUser.first_name} ${patientUser.last_name} has been changed. \n Please save this event to your calendar, and remove the previous appointment. \n To save this event in your calendar you must do this: \n 1. Open the ics attachment \n 2. Click 'Save & close'`,
    icalEvent: event
  }
}

let iCalAttachmentGenerator = function (appointment, patientUser) {
  const cal = ical();
  const [startDateTime, endDateTime] = getDateTime(appointment.start_date, appointment.start_time, appointment.end_time);

  let event = cal.createEvent({
    start: startDateTime,
    end: endDateTime,
    summary: `${appointment.type_of_therapy} appointment with ${patientUser.first_name} ${patientUser.last_name}`,
    description: ''
  });
  // no more repeats. keeping here if we decide to change requirements.
  return cal.toString();
}

let getDateTime = function(date, startTime, endTime) {
  let dateString = date.toString();
  let startFullTime = moment.tz(dateString + "T" + startTime.toString(), "YYYY-MM-DDTHH:mm:ss", "America/Vancouver");
  let endFullTime = moment.tz(dateString + "T" + endTime.toString(), "YYYY-MM-DDTHH:mm:ss", "America/Vancouver");

  return [startFullTime.toDate(), endFullTime.toDate()];
}

module.exports = {
  sendMailForAppointment: function(appointment, patientUser, staffUser, isNewAppointment) {
    let transport = getTransporter();
    let mailOptions;
    if(isNewAppointment) {
      mailOptions = generateMailOptionsForNewAppointment(appointment, patientUser, staffUser);
    } else {
      mailOptions = generateMailOptionsForUpdateAppointment(appointment, patientUser, staffUser);
    }
    transporter.sendMail(mailOptions, function (err, info) {
      if(err)
        return false;
      else
        return true;
   });
  }
}