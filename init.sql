USE test_db;
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL
);

CREATE TABLE post (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id)
);