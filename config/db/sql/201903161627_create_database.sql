DROP DATABASE IF EXISTS schedule_system;

CREATE DATABASE schedule_system;
use schedule_system;

CREATE TABLE IF NOT EXISTS User
  (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone_number VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    type ENUM ('Administrator', 'Staff', 'Patient'),
    permission_level ENUM ('Low', 'Medium', 'High'),
    active BOOLEAN NOT NULL,
    PRIMARY KEY(id),
    UNIQUE KEY(username)
  );

CREATE TABLE IF NOT EXISTS Administrator
  (
    id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (id) REFERENCES User(id)
  );

CREATE TABLE IF NOT EXISTS Staff
  (
    id INT NOT NULL,
    therapist_code VARCHAR(10) NOT NULL,
    therapist_type VARCHAR(255) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (id) REFERENCES User(id)
  );

CREATE TABLE IF NOT EXISTS Patient
  (
    id INT NOT NULL,
    mrn VARCHAR(255),
    address VARCHAR(255) NOT NULL,
    emergency_contact VARCHAR(255),
    is_in_patient BOOLEAN NOT NULL,
    patient_program VARCHAR(5) NOT NULL,
    date_of_birth date NOT NULL,
    current_admission_record INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (id) REFERENCES User(id),
    UNIQUE KEY(mrn)
  );

CREATE TABLE IF NOT EXISTS Admission_record
  (
    id INT NOT NULL AUTO_INCREMENT,
    patient_id INT NOT NULL,
    patient_category INT NOT NULL,
    admission_date date NOT NULL,
    discharge_date date,
    type_of_injury VARCHAR(255) NOT NULL,
    comment VARCHAR(255),
    created_at DATETIME,
    PRIMARY KEY(id),
    FOREIGN KEY (patient_id) REFERENCES Patient(id)
  );

CREATE TABLE IF NOT EXISTS Appointment
  (
    id INT NOT NULL AUTO_INCREMENT,
    patient_id INT NOT NULL,
    staff_id INT NOT NULL,
    record_id INT NOT NULL,
    patient_category INT NOT NULL,
    type_of_therapy VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    repetition ENUM ('none', 'daily', 'weekly', 'biweekly', 'monthly'),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_cancelled BOOLEAN NOT NULL, 
    PRIMARY KEY(id),
    FOREIGN KEY (patient_id) REFERENCES Patient(id),
    FOREIGN KEY (staff_id) REFERENCES Staff(id),
    FOREIGN KEY (record_id) REFERENCES Admission_record(id)
  );

commit;