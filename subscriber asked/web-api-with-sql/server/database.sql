drop database test;

CREATE DATABASE test;

\connect test;

drop table demo;

CREATE TABLE demo(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    mail VARCHAR(255),
    createdAt VARCHAR(255)
);