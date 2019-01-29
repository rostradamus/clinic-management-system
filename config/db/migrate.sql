DROP DATABASE IF EXISTS schedule_system;

CREATE DATABASE schedule_system;
use schedule_system;


-- Initial table setup for sample Note Feature
CREATE TABLE IF NOT EXISTS notes(
  note_id INT AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (note_id)
);

INSERT INTO notes(title, content)
VALUES ("test title1", "test content1"),
("test title2", "test content2");