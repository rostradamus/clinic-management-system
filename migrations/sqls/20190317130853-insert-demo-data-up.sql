START TRANSACTION;
-- Sample user data
INSERT INTO User values (1, "1234", "samplepass1", "seongchan@test.com", "778-123-4567", "Seongchan", "Lee", "Patient", "Low", true);
INSERT INTO User values (2, "dennisyi@test.com", "samplepass2", "dennisyi@test.com", "778-891-0111", "Dennis", "Yi", "Administrator", "High", true);
INSERT INTO User values (3, "mikeyoon@test.com", "samplepass3", "mikeyoon@test.com", "778-213-1415", "Mike", "Yoon", "Staff", "Medium", true);
INSERT INTO User values (4, "5678", "samplepass4", "jamie@test.com", "778-161-7181", "Jamie", "Jeon", "Patient", "Low", true);
INSERT INTO User values (5, "kennypark@test.com", "samplepass5", "kennypark@test.com", "778-920-2122", "Kenny", "Park", "Administrator", "High", true);
INSERT INTO User values (6, "rolee@test.com", "samplepass6", "rolee@test.com", "778-232-4252", "Ro", "Lee", "Staff", "Medium", true);
INSERT INTO User values (7, "9101", "samplepass7", "david@test.com", "778-627-2829", "David", "Kim", "Patient", "Low", true);

-- Sample administrator data
INSERT INTO Administrator values (2);
INSERT INTO Administrator values (5);

-- Sample Staff data
INSERT INTO Staff values (3, "code1", "PT");
INSERT INTO Staff values (6, "code2", "SLP");

-- Sample Patient data
INSERT INTO Patient values (1, "1234", "somewhere over the rainbow", "778-303-1323", true, "prog1", '1996-01-01');
INSERT INTO Patient values (4, "5678", "somewhere over ubc", null, false, "prog2", '1996-01-01');
INSERT INTO Patient values (7, "9101", "somewhere over point grey", "778-334-3536", true, "prog3", '1993-01-01');

-- Sample Admission_record data
INSERT INTO Admission_record values (1, 1, 3, '2018-02-01', '2018-03-01', "brain injury", "ayy lmao", NOW());
INSERT INTO Admission_record values (2, 1, 3, '2018-05-02', null, "spine injury", "bigg yikes", NOW());
INSERT INTO Admission_record values (3, 4, 2, '2018-12-12', null, "head injury", "hehe xd", NOW());
INSERT INTO Admission_record values (4, 7, 1, '2019-01-01', null, "arm injury", null, NOW());

-- Sample Appointment data
INSERT INTO Appointment values (1, 1, 3, 1, 3, "type1", '2019-01-01', '2019-01-01', "none", '13:00:00', '13:30:00', false);
INSERT INTO Appointment values (2, 1, 6, 2, 3, "type2", '2019-01-02', '2019-01-02', "none", '12:30:00', '14:00:00', false);
INSERT INTO Appointment values (3, 4, 3, 3, 2, "type1", '2019-01-03', '2019-01-03 ', "none", '15:30:00', '17:00:00', false);
INSERT INTO Appointment values (4, 7, 6, 4, 1, "type3", '2019-01-04', '2019-01-04', "none", '15:30:00', '17:00:00', false);
INSERT INTO Appointment values (5, 1, 3, 4, 1, "type3", '2019-01-04', '2019-01-30', "weekly", '15:30:00', '17:00:00', false);

COMMIT;