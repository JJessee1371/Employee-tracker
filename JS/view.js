const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();
const util = require('util');
var queryPromise;
var closePromise;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: process.env.DB_PASS,
    database: 'employee_tracker_db'
});

//Prompt the user for information on what data they wish to see
module.exports = {
    read:
    async function viewData() {  
        let desiredAction = await inquirer.prompt([
            {
                name: 'action',
                type: 'list',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'View employees by manager'
                ],
                message: 'Please select the action you would like to perform:'
            }
        ]);

        let choice = desiredAction.action;
        let result;

        switch(choice) {
            case 'View all departments':
                result = await queryPromise('SELECT name AS Departments FROM department');
                console.table(result);
                break;

            case 'View all roles':
                result = await queryPromise(
                    `SELECT title AS Title, salary AS Salary, name AS Department
                    FROM role AS t1
                    JOIN department AS t2 ON t1.department_id = t2.department_id
                    ORDER BY name`
                );
                console.table(result);
                break;

            //JOIN for full employee data including role and manager
            case 'View all employees':
                result = await queryPromise(
                    `SELECT employee_id AS ID, first_name AS First, last_name AS Last, manager_id AS Manager_ID, title AS Title, salary AS Salary, name AS Department
                    FROM employee AS t1
                    JOIN role AS t2 ON t1.role_id = t2.role_id
                    JOIN department AS t3 ON t2.department_id = t3.department_id
                    ORDER BY Last`
                );
                console.table(result);
                break;

            case 'View employees by manager':
                let managerName = await inquirer.prompt([
                    {
                        name: 'first',
                        type: 'input',
                        message: 'What is the managers\' first name?'
                    }, 
                    {
                        name: 'last',
                        type: 'input',
                        message: 'What is the managers\' last name?'
                    }
                ]);

                //Get the employee ID of the manager
                let managerID = await queryPromise('SELECT employee_id FROM employee WHERE first_name = ? AND last_name = ?',
                [managerName.first, managerName.last]);
                //Locate all employees with the retrieved manager ID
                let employees = await queryPromise (
                    `SELECT employee_id AS ID, first_name AS First, last_name AS Last, manager_id AS Manager_ID, title AS Title, salary AS Salary, name AS Department
                    FROM employee AS t1
                    JOIN role AS t2 ON t1.role_id = t2.role_id
                    JOIN department AS t3 ON t2.department_id = t3.department_id
                    WHERE Manager_id = ?
                    ORDER BY Last`,
                [managerID[0].employee_id]);
                console.table(employees);
                break;
        };
    }
};

connection.connect((err) => {
    if(err) console.log(err);
    queryPromise = util.promisify(connection.query).bind(connection);
    closePromise = util.promisify(connection.end).bind(connection);
});

process.on('beforeExit', function() {
    closePromise();
});
