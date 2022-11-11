USE battleship;

DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS game;

CREATE TABLE user (
  email VARCHAR(30) PRIMARY KEY,
  username VARCHAR(20) UNIQUE NOT NULL,
  role VARCHAR(10) NOT NULL,
  playing BOOLEAN NOT NULL,
  token DOUBLE(25,2) NOT NULL
);

CREATE TABLE game (
  id INT PRIMARY KEY AUTO_INCREMENT,
  player1 VARCHAR(30) NOT NULL,
  player2 VARCHAR(30),
  player3 VARCHAR(30),
  ia BOOLEAN NOT NULL,
  grid1 TEXT NOT NULL,
  grid2 TEXT,
  grid3 TEXT,
  gridIA TEXT,
  attaccante VARCHAR(30),
  difensore VARCHAR(30),
  in_progress BOOLEAN NOT NULL,
  vincitore VARCHAR(30),
  perdente1 VARCHAR(30),
  perdente2 VARCHAR(30),
  start_date DATE NOT NULL,
  end_date DATE,
  FOREIGN KEY (player1) REFERENCES user(email),
  FOREIGN KEY (player2) REFERENCES user(email),
  FOREIGN KEY (player3) REFERENCES user(email),
  FOREIGN KEY (attaccante) REFERENCES user(email),
  FOREIGN KEY (difensore) REFERENCES user(email),
  FOREIGN KEY (vincitore) REFERENCES user(email),
  FOREIGN KEY (perdente1) REFERENCES user(email),
  FOREIGN KEY (perdente2) REFERENCES user(email)
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