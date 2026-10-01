SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE tickets;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Password is 'password123'
INSERT INTO users (username, email, password, role) VALUES ('admin', 'admin@servicedesk.com', '$2a$10$Ep2/wJtWc.42.0Hn0/Gj.uG1lCInG.x1q47c4Nq359.xK/2D4cQo6', 'ROLE_ADMIN');
