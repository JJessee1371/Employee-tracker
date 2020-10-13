DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department (
	department_id INT(10) NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (department_id)
);

CREATE TABLE role (
	role_id INT(10) NOT NULL AUTO_INCREMENT,
	title VARCHAR(30) NOT NULL,
	salary DECIMAL(10,2) NOT NULL,
	department_id INT(10),
		FOREIGN KEY (department_id)
		REFERENCES department (department_id),
	PRIMARY KEY (role_id)
);

CREATE TABLE employee (
	employee_id INT(10) NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(30) NOT NULL,
	last_name VARCHAR(30) NOT NULL,
	role_id INT(10),
		FOREIGN KEY (role_id)
		REFERENCES role (role_id),
	manager_id INT(10),
		FOREIGN KEY (manager_id) 
		REFERENCES employee (employee_id),
	PRIMARY KEY (employee_id)
);