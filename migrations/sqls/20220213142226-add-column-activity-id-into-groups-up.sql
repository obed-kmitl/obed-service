ALTER TABLE groups
ADD COLUMN activity_id INT NOT NULL REFERENCES activities(activity_id) ON DELETE CASCADE