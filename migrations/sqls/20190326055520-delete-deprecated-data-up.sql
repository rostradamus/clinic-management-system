-- Delete Appointments with wrong type of therapy
DELETE FROM Appointment WHERE type_of_therapy = "type1";
DELETE FROM Appointment WHERE type_of_therapy = "type2";
DELETE FROM Appointment WHERE type_of_therapy = "type3";
DELETE FROM Appointment WHERE type_of_therapy = "STUB";