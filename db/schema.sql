DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
  id PRIMARY KEY (id)
  name VARCHAR(30) NOT NULL,
);

CREATE TABLE role (
  id PRIMARY KEY (id)
  title VARCHAR(30) NOT NULL,
  salary DECIMAL() NOT NULL,
  department_id INT NOT NULL,
);

CREATE TABLE employee (
  id INT PRIMARY KEY (id)
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NOT NULL,
);