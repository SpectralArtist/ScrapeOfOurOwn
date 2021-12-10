/*
    WARNING: All data collected will be lost if this script is used
*/

DROP DATABASE IF EXISTS scrapeofourown;
CREATE DATABASE scrapeofourown;
USE scrapeofourown;

CREATE TABLE webscrapers (
    `name` VARCHAR(255) PRIMARY KEY,
    link text NOT NULL,
    public BOOLEAN DEFAULT false,
    createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO webscrapers (`name`, link) 
VALUES ('Original Works', 'https://archiveofourown.org/tags/Original%20Work/works'),
('Poetry', 'https://archiveofourown.org/tags/Poetry/works');

CREATE TABLE scrapesets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    webscraperId VARCHAR(255),
    createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (webscraperId) REFERENCES webscrapers(name)
);

CREATE TABLE authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE stories (
    id INT NOT NULL,
    scrapesetId INT NOT NULL,
    authorId INT,
    title VARCHAR(255),
    publish VARCHAR(255),
    `language` VARCHAR(255),
    words INT,
    comments INT,
    views INT,
    likes INT,
    collections INT,
    chapters INT,
    series BOOLEAN,
    complete BOOLEAN,
    createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id, scrapesetId),
    FOREIGN KEY (scrapesetId) REFERENCES scrapesets(id),
    FOREIGN KEY (authorId) REFERENCES authors(id)
);

CREATE TABLE tags (
    storyId INT NOT NULL,
    `type` VARCHAR(32) NOT NULL,
    tag VARCHAR(255) NOT NULL,
    createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(storyId, `type`, tag)
);