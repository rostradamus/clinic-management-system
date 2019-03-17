START TRANSACTION;
-- Sample Appointment data
DELETE FROM Appointment WHERE id = 1;
DELETE FROM Appointment WHERE id = 2;
DELETE FROM Appointment WHERE id = 3;
DELETE FROM Appointment WHERE id = 4;
DELETE FROM Appointment WHERE id = 5;

-- Sample Admission_record data
DELETE FROM Admission_record WHERE id = 1;
DELETE FROM Admission_record WHERE id = 2;
DELETE FROM Admission_record WHERE id = 3;
DELETE FROM Admission_record WHERE id = 4;

-- Sample user data
DELETE FROM User WHERE id = 1;
DELETE FROM User WHERE id = 2;
DELETE FROM User WHERE id = 3;
DELETE FROM User WHERE id = 4;
DELETE FROM User WHERE id = 5;
DELETE FROM User WHERE id = 6;
DELETE FROM User WHERE id = 7;

COMMIT;