-- Sample user data
INSERT INTO User values ("seongchanlee", "samplepass1", "sample1@gmail.com", "778-123-4567", "Seongchan", "Lee", "Patient", "Low", true);
INSERT INTO User values ("dennisyi", "samplepass2", "sample2@gmail.com", "778-891-0111", "Dennis", "Yi", "Administrator", "High", true);
INSERT INTO User values ("mikeyoon", "samplepass3", "sample3@gmail.com", "778-213-1415", "Mike", "Yoon", "Staff", "Medium", true);
INSERT INTO User values ("jamiejeon", "samplepass4", "sample4@gmail.com", "778-161-7181", "Jamie", "Jeon", "Patient", "Low", true);
INSERT INTO User values ("kennypark", "samplepass5", "sample5@gmail.com", "778-920-2122", "Kenny", "Park", "Administrator", "High", true);
INSERT INTO User values ("rolee", "samplepass6", "sample6@gmail.com", "778-232-4252", "Ro", "Lee", "Staff", "Medium", true);
INSERT INTO User values ("davidkim", "samplepass7", "sample7@gmail.com", "778-627-2829", "David", "Kim", "Patient", "Low", true);

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
INSERT INTO Admission_record values (null, "seongchanlee", '2018-02-01', '2018-03-01', "brain injury", "ayy lmao", NOW());
INSERT INTO Admission_record values (null, "seongchanlee", '2018-05-02', null, "spine injury", "bigg yikes", NOW());
INSERT INTO Admission_record values (null, "jamiejeon", '2018-12-12', null, "head injury", "hehe xd", NOW());
INSERT INTO Admission_record values (null, "davidkim", '2019-01-01', null, "arm injury", null, NOW());

-- Sample Appointment data
INSERT INTO Appointment values (null, "seongchanlee", "mikeyoon", 1, "type1", '2019-01-01 13:00:00', '2019-01-01 13:30:00', "sample location 1", "none", null);
INSERT INTO Appointment values (null, "seongchanlee", "rolee", 2, "type2", '2019-01-02 12:30:00', '2019-01-02 14:00:00', "sample location 2", "weekly", null);
INSERT INTO Appointment values (null, "jamiejeon", "mikeyoon", 3, "type1", '2019-01-03 15:30:00', '2019-01-03 17:00:00', "sample location 2", "monthly", "hehe xd");
INSERT INTO Appointment values (null, "davidkim", "rolee", 4, "type3", '2019-01-04 15:30:00', '2019-01-04 17:00:00', "sample location 2", "none", "hue");