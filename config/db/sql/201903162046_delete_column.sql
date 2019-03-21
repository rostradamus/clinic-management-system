ALTER TABLE Patient
DROP COLUMN current_admission_record;

ALTER TABLE User
ALTER active SET DEFAULT true;

ALTER TABLE Admission_record
CHANGE COLUMN created_at created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;