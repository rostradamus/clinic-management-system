const nodemailer = require("nodemailer");
const ical = require('ical-generator');
let transporter;

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

let generateMailOptions = function(bShouldCreateICalEvent) {
  let event = "";
  if (bShouldCreateICalEvent) {
    event = iCalAttachmentGenerator();
  }
  // if icalEvent is empty string, it doesn't send a ics attachment
  return {
    from: "gfstrongtest123@gmail.com",
    to: "mikeyoon@hotmail.ca",
    subject: "testing sending email",
    text: "hello world",
    icalEvent: event
  }
}

let iCalAttachmentGenerator = function () {
  const cal = ical();
  let event = cal.createEvent({
    start: new Date(),
    end: new Date(new Date().getTime() + 3600000),
    summary: 'Example Event',
    description: 'It works ;)',
    // TODO: organizer will be the staff
    organizer: 'Organizer\'s Name <organizer@example.com>'
  });
  // TODO: check if repeating is needed
  event.repeating({
    freq: 'WEEKLY',
    // TODO: the real date will be in the appointment object
    until: new Date('Apr 01 2019 00:00:00 UTC'),
    exclude: [new Date('Dec 25 2013 00:00:00 UTC')] // TODO: will need to do something with moment to exclude bc holidays
  });
  console.log(cal.toString());
  return cal.toString();
}

module.exports = {
  sendMail: function() {
    let transport = getTransporter();
    // TODO: check here if we need an ics attachment
    let mailOptions = generateMailOptions(true);
    transporter.sendMail(mailOptions, function (err, info) {
      if(err)
        return false;
      else
        return true;
   });
  }
}