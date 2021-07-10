DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS device;
DROP TABLE IF EXISTS device_history;
DROP TABLE IF EXISTS user_device;
DROP TABLE IF EXISTS device_count;
CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL
);
CREATE TABLE device (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_name TEXT,
  added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE user_device (
  userId INTEGER NOT NULL,
  deviceId INTEGER NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (userId, deviceId),
  FOREIGN KEY (userId) REFERENCES user (id),
  FOREIGN KEY (deviceId) REFERENCES device (id)
);
CREATE TABLE device_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id INTEGER NOT NULL,
  alert INTEGER NOT NULL,
  info TEXT NOT NULL,
  lat double NOT NULL,
  lng double NOT NULL,
  timesta bigint NOT NULL,
  val INTEGER NOT NULL
);
CREATE TABLE device_count (
  user_id INTEGER NOT NULL,
  count INTEGER NOT NULL,
  time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
insert into
  device (device_name)
values
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default"),
  ("default");