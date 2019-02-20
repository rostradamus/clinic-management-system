-- Sample user data
INSERT INTO User values ("seongchanlee", "samplepass1", "sample1@gmail.com", "778-123-4567", "Seongchan", "Lee", "Patient", 0, true);
INSERT INTO User values ("dennisyi", "samplepass2", "sample2@gmail.com", "778-891-0111", "Dennis", "Yi", "Administrator", 2, true);
INSERT INTO User values ("mikeyoon", "samplepass3", "sample3@gmail.com", "778-213-1415", "Mike", "Yoon", "Staff", 1, true);
INSERT INTO User values ("jamiejeon", "samplepass4", "sample4@gmail.com", "778-161-7181", "Jamie", "Jeon", "Patient", 0, true);
INSERT INTO User values ("kennypark", "samplepass5", "sample5@gmail.com", "778-920-2122", "Kenny", "Park", "Administrator", 2, true);
INSERT INTO User values ("rolee", "samplepass6", "sample6@gmail.com", "778-232-4252", "Ro", "Lee", "Staff", 1, true);
INSERT INTO User values ("davidkim", "samplepass7", "sample7@gmail.com", "778-627-2829", "David", "Kim", "Patient", 0, true);

-- Sample administrator data
INSERT INTO Administrator values ("dennisyi");
INSERT INTO Administrator values ("kennypark");

-- Sample Staff data
INSERT INTO Staff values ("mikeyoon", "code1", "PT");
INSERT INTO Staff values ("rolee", "code2", "SLP");

-- Sample Patient data
INSERT INTO Patient values ("seongchanlee", "1234", "somewhere over the rainbow", "778-303-1323", 1, true, "prog1", '1996-01-01');
INSERT INTO Patient values ("jamiejeon", "5678", "somewhere over ubc", null, 2, false, "prog2", '1996-01-01');
INSERT INTO Patient values ("davidkim", "9101", "somewhere over point grey", "778-334-3536", 3, true, "prog3", '1993-01-01');

-- Sample Admission_record data
INSERT INTO Admission_record values ("slee-20180201", "seongchanlee", '2018-02-01', '2018-03-01', "brain injury", "ayy lmao", NOW());
INSERT INTO Admission_record values ("slee-20180502", "seongchanlee", '2018-05-02', null, "spine injury", "bigg yikes", NOW());
INSERT INTO Admission_record values ("jjeon-20181212", "jamiejeon", '2018-12-12', null, "head injury", "hehe xd", NOW());
INSERT INTO Admission_record values ("dkim-20190101", "davidkim", '2019-01-01', null, "arm injury", null, NOW());

-- Sample Appointment data
INSERT INTO Appointment values (123123, "seongchanlee", "mikeyoon", "slee-20180502", "type1", 120, null);
INSERT INTO Appointment values (123124, "seongchanlee", "rolee", "slee-20180502", "type2", 150, null);
INSERT INTO Appointment values (123125, "jamiejeon", "mikeyoon", "jjeon-20181212", "type1", 120, "hehe xd");
INSERT INTO Appointment values (123126, "davidkim", "rolee", "dkim-20190101", "type2", 150, "hue");