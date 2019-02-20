DROP DATABASE IF EXISTS schedule_system;

CREATE DATABASE schedule_system;
use schedule_system;

CREATE TABLE IF NOT EXISTS User
  (
    username varchar(255),
    password varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    phone_num varchar(255) NOT NULL,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    type ENUM ('Administrator', 'Staff', 'Patient'),
    permission_level ENUM ('Low', 'Medium', 'High'),
    active boolean NOT NULL,
    PRIMARY KEY(username)
  );

CREATE TABLE IF NOT EXISTS Administrator
  (
    username varchar(255),
    PRIMARY KEY(username),
    FOREIGN KEY (username) REFERENCES User(username)
  );

CREATE TABLE IF NOT EXISTS Staff
  (
    username varchar(255),
    therapist_code varchar(10) NOT NULL,
    therapist_type varchar(255) NOT NULL,
    PRIMARY KEY(username),
    FOREIGN KEY (username) REFERENCES User(username)
  );

CREATE TABLE IF NOT EXISTS Patient
  (
    username varchar(255),
    patient_num varchar(255) NOT NULL,
    address varchar(255) NOT NULL,
    emergency_contact varchar(255),
    patient_category int NOT NULL,
    is_in_patient boolean NOT NULL,
    patient_program varchar(5) NOT NULL,
    birthday date NOT NULL,
    PRIMARY KEY(username),
    FOREIGN KEY (username) REFERENCES User(username)
  );

CREATE TABLE IF NOT EXISTS Admission_record
  (
    record_id int AUTO_INCREMENT,
    patient_id varchar(255) NOT NULL,
    admission_date date NOT NULL,
    discharge_date date,
    type_of_injury varchar(255) NOT NULL,
    comment varchar(255),
    creation_date datetime,
    PRIMARY KEY(record_id),
    FOREIGN KEY (patient_id) REFERENCES Patient(username)
  );

CREATE TABLE IF NOT EXISTS Appointment
  (
    appointment_id int AUTO_INCREMENT,
    patient_id varchar(255) NOT NULL,
    staff_id varchar(255) NOT NULL,
    record_id int NOT NULL,
    type_of_therapy varchar(255) NOT NULL,
    duration int NOT NULL,
    note varchar(255),
    PRIMARY KEY(appointment_id),
    FOREIGN KEY (patient_id) REFERENCES Patient(username),
    FOREIGN KEY (staff_id) REFERENCES Staff(username),
    FOREIGN KEY (record_id) REFERENCES Admission_record(record_id)
  );

commit;