ALTER TABLE Appointment
  DROP COLUMN duration,
  ADD COLUMN start_date datetime NOT NULL AFTER type_of_therapy,
  ADD COLUMN end_date datetime NOT NULL AFTER start_date,
  ADD COLUMN repetition varchar(255) NOT NULL AFTER end_date;