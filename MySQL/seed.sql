INSERT INTO department (name)
VALUES ('Management'), 
('Sales'), 
('Human Resources'), 
('Accounting'), 
('Quality Assurance'), 
('Warehouse'),
('Reception');

INSERT INTO role (title, salary, department_id)
VALUES ('Branch Manager', 80000, 1),
('Paper Salesperson', 65000, 2),
('HR Rep', 60000, 3),
('Accountant', 50000, 4),
('Quality Tester', 65000, 5),
('Delivery', 70000, 6),
('Reception', 55000, 7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Michael', 'Scott', 1, null),
('Dwight', 'Schrute', 2, 1),
('Jim', 'Halpert', 2, 2),
('Pam', 'Beasley', 2, 2),
('Andy', 'Bernard', 2, 2),
('Stanley', 'Hudson', 2, 2),
('Phyllis', 'Vance', 2, 2),
('Toby', 'Flenderson', 3, 1),
('Gabe', 'Lewis', 3, 8),
('Angela', 'Martin', 4, 1),
('Oscar', 'Martinez', 4, 10),
('Kevin', 'Malone', 4, 10),
('Meredith', 'Palmer', 5, 1),
('Creed', 'Bratton', 5, 13),
('Darryl', 'Philbin', 6, 1),
('Erin', 'Hannon', 7, 1);