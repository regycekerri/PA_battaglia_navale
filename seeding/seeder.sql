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
  FOREIGN KEY (player3) REFERENCES user(email)
);

CREATE TABLE move (
  id_game INT NOT NULL,
  id INT PRIMARY KEY AUTO_INCREMENT,
  attaccante VARCHAR(30) NOT NULL,
  difensore VARCHAR(30) NOT NULL,
  x INT NOT NULL,
  y INT NOT NULL,
  colpita_nave BOOLEAN NOT NULL,
  FOREIGN KEY (id_game) REFERENCES game(id)
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

INSERT INTO game (id, player1, player2, player3, ia, grid1, grid2, grid3, gridIA, attaccante, difensore, 
                  in_progress, vincitore, perdente1, perdente2, start_date, end_date) VALUES
  (1, "regy.cekerri@gmail.com", "davide.malatesta@gmail.com", NULL, FALSE,
    '{"grid":[[{"type":0,"attacked":false},{"type":0,"attacked":false},{"type":0,"attacked":true},{"type":0,"attacked":false},{"type":0,"attacked":false}],[{"type":0,"attacked":false},{"type":0,"attacked":false},{"type":0,"attacked":false},{"type":0,"attacked":true},{"type":0,"attacked":false}],[{"type":0,"attacked":true},{"type":0,"attacked":false},{"type":0,"attacked":false},{"type":0,"attacked":false},{"type":0,"attacked":true}],[{"type":0,"attacked":true},{"type":0,"attacked":true},{"type":0,"attacked":false},{"type":0,"attacked":true},{"type":0,"attacked":false}],[{"type":0,"attacked":true},{"type":0,"attacked":false},{"type":0,"attacked":true},{"type":0,"attacked":true},{"type":0,"attacked":false}]]}',
    '{"grid":[[{"type":0,"attacked":true},{"type":0,"attacked":true},{"type":0,"attacked":false},{"type":0,"attacked":true},{"type":0,"attacked":false}],[{"type":0,"attacked":false},{"type":0,"attacked":true},{"type":0,"attacked":true},{"type":0,"attacked":false},{"type":0,"attacked":false}],[{"type":0,"attacked":false},{"type":0,"attacked":true},{"type":0,"attacked":true},{"type":0,"attacked":false},{"type":0,"attacked":true}],[{"type":0,"attacked":true},{"type":0,"attacked":false},{"type":0,"attacked":false},{"type":0,"attacked":false},{"type":2,"attacked":false}],[{"type":0,"attacked":false},{"type":0,"attacked":false},{"type":0,"attacked":false},{"type":0,"attacked":false},{"type":0,"attacked":true}]]}',
    NULL, NULL, NULL, NULL, FALSE, "davide.malatesta@gmail.com", "regy.cekerri@gmail.com", NULL, '2022-10-13', '2022-11-12'),
  (2, "francesco.schettino@gmail.com", "capitano.uncino@gmail.com", NULL, FALSE, 
    '{"grid":[[{"type":0,"attacked":true},{"type":0,"attacked":false},{"type":0,"attacked":true}],[{"type":0,"attacked":true},{"type":0,"attacked":true},{"type":0,"attacked":true}],[{"type":0,"attacked":false},{"type":0,"attacked":false},{"type":0,"attacked":true}]]}',
    '{"grid":[[{"type":0,"attacked":true},{"type":0,"attacked":true},{"type":0,"attacked":false}],[{"type":0,"attacked":true},{"type":0,"attacked":true},{"type":1,"attacked":false}],[{"type":0,"attacked":true},{"type":0,"attacked":false},{"type":0,"attacked":true}]]}',
    NULL, NULL, NULL, NULL, FALSE, "capitano.uncino@gmail.com", "francesco.schettino@gmail.com", NULL,'2022-09-03', '2022-11-05'),
  (3, "horatio.nelson@gmail.com", NULL, NULL, TRUE,
    '{"grid":[[{"type":0,"attacked":false},{"type":0,"attacked":true},{"type":0,"attacked":false}],[{"type":1,"attacked":false},{"type":0,"attacked":false},{"type":0,"attacked":false}],[{"type":0,"attacked":false},{"type":0,"attacked":false},{"type":0,"attacked":false}]]}',
    NULL, NULL,
    '{"grid":[[{"type":0,"attacked":true},{"type":1,"attacked":false},{"type":0,"attacked":false}],[{"type":0,"attacked":false},{"type":0,"attacked":false},{"type":0,"attacked":false}],[{"type":0,"attacked":false},{"type":0,"attacked":false},{"type":0,"attacked":false}]]}',
    "horatio.nelson@gmail.com", "ia", TRUE, NULL, NULL, NULL, '2022-11-12', NULL);

INSERT INTO move (id_game, id, attaccante, difensore, x, y, colpita_nave) VALUES 
  (1, 1, "regy.cekerri@gmail.com", "davide.malatesta@gmail.com", 3, 2, FALSE),
  (1, 2, "davide.malatesta@gmail.com", "regy.cekerri@gmail.com", 4, 2, FALSE),
  (1, 3, "regy.cekerri@gmail.com", "davide.malatesta@gmail.com", 2, 3, FALSE),
  (1, 4, "davide.malatesta@gmail.com", "regy.cekerri@gmail.com", 4, 4, FALSE),
  (1, 5, "regy.cekerri@gmail.com", "davide.malatesta@gmail.com", 1, 2, FALSE),
  (1, 6, "davide.malatesta@gmail.com", "regy.cekerri@gmail.com", 5, 3, FALSE),
  (1, 7, "regy.cekerri@gmail.com", "davide.malatesta@gmail.com", 1, 4, FALSE),
  (1, 8, "davide.malatesta@gmail.com", "regy.cekerri@gmail.com", 3, 5, FALSE),
  (1, 9, "regy.cekerri@gmail.com", "davide.malatesta@gmail.com", 1, 1, FALSE),
  (1, 10, "davide.malatesta@gmail.com", "regy.cekerri@gmail.com", 4, 1, TRUE),
  (1, 11, "regy.cekerri@gmail.com", "davide.malatesta@gmail.com", 4, 1, FALSE),
  (1, 12, "davide.malatesta@gmail.com", "regy.cekerri@gmail.com", 5, 1, FALSE),
  (1, 13, "regy.cekerri@gmail.com", "davide.malatesta@gmail.com", 3, 3, FALSE),
  (1, 14, "davide.malatesta@gmail.com", "regy.cekerri@gmail.com", 3, 1, TRUE),
  (1, 15, "regy.cekerri@gmail.com", "davide.malatesta@gmail.com", 5, 5, FALSE),
  (1, 16, "davide.malatesta@gmail.com", "regy.cekerri@gmail.com", 2, 4, FALSE),
  (1, 17, "regy.cekerri@gmail.com", "davide.malatesta@gmail.com", 2, 2, TRUE),
  (1, 18, "davide.malatesta@gmail.com", "regy.cekerri@gmail.com", 5, 4, FALSE),
  (1, 19, "regy.cekerri@gmail.com", "davide.malatesta@gmail.com", 3, 5, TRUE),
  (1, 20, "davide.malatesta@gmail.com", "regy.cekerri@gmail.com", 1, 3, TRUE),
  (2, 21, "francesco.schettino@gmail.com", "capitano.uncino@gmail.com", 2, 2, FALSE),
  (2, 22, "capitano.uncino@gmail.com", "francesco.schettino@gmail.com", 1, 1, FALSE),
  (2, 23, "francesco.schettino@gmail.com", "capitano.uncino@gmail.com", 1, 2, FALSE),
  (2, 24, "capitano.uncino@gmail.com", "francesco.schettino@gmail.com", 2, 2, FALSE),
  (2, 25, "francesco.schettino@gmail.com", "capitano.uncino@gmail.com", 2, 1, TRUE),
  (2, 26, "capitano.uncino@gmail.com", "francesco.schettino@gmail.com", 1, 3, FALSE),
  (2, 27, "francesco.schettino@gmail.com", "capitano.uncino@gmail.com", 3, 1, FALSE),
  (2, 28, "capitano.uncino@gmail.com", "francesco.schettino@gmail.com", 2, 3, TRUE),
  (2, 29, "francesco.schettino@gmail.com", "capitano.uncino@gmail.com", 1, 1, TRUE),
  (2, 30, "capitano.uncino@gmail.com", "francesco.schettino@gmail.com", 3, 3, TRUE),
  (2, 31, "francesco.schettino@gmail.com", "capitano.uncino@gmail.com", 3, 3, FALSE),
  (2, 32, "capitano.uncino@gmail.com", "francesco.schettino@gmail.com", 2, 1, TRUE),
  (3, 33, "horatio.nelson@gmail.com", "ia", 1, 1, FALSE),
  (3, 34, "ia", "horatio.nelson@gmail.com", 1, 2, FALSE);


