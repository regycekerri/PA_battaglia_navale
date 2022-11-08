DROP TABLE IF EXISTS user;

CREATE TABLE user (
  email VARCHAR(30) NOT NULL,
  username VARCHAR(20) NOT NULL,
  role VARCHAR(10) NOT NULL,
  playing BOOLEAN NOT NULL,
  token DOUBLE(25,2) NOT NULL, 
  PRIMARY KEY (email),
  UNIQUE (username)
);

INSERT INTO user (email, username, role, playing, token) VALUES
  ('adriano.mancini@gmail.com', 'Adriano', 'admin', FALSE, 100.00),
  ('regy.cekerri@gmail.com', 'Regy', 'player', FALSE, 10.00),
  ('davide.malatesta@gmail.com', 'Davide', 'player', FALSE, 10.00),
  ('horatio.nelson@gmail.com', 'Nelson', 'player', FALSE, 0.30),
  ('francesco.schettino@gmail.com', 'Schettino', 'player', FALSE, 0.35),
  ('will.murdoch@gmail.com', 'Murdoch', 'player', FALSE, 5.00),
  ('capitano.uncino@gmail.com', 'Capitano Uncino', 'player', FALSE, 7.50),
  ('mugiwara@gmail.com', 'Rufy', 'player', FALSE, 25.00),
  ('cristoforo.colombo@gmail.com', 'Colombo', 'player', FALSE, 15.40),
  ('neil.armstrong@gmail.com', 'Armstrong', 'player', FALSE, 75.00);