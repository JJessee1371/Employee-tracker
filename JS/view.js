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
    function viewData() {
        inquirer.prompt([
            {
                name: 'choice',
                type: 'list',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees'
                ],
                message: 'Please select the action you would like to perform:'
            }
        ])
        .then(async (data) => {
            let choice = data.choice;
            let result;

            switch(choice) {
                case 'View all departments':
                    result = await queryPromise('SELECT name FROM department');
                    console.table(result);
                    break;

                case 'View all roles':
                    result = await queryPromise(
                        `SELECT title, salary, name AS department_name
                        FROM role AS t1
                        JOIN department AS t2 ON t1.department_id = t2.department_id
                        ORDER BY name`
                    );
                    console.table(result);
                    break;

                //JOIN for full employee data including role and manager
                case 'View all employees':
                    result = await queryPromise(
                        `SELECT employee_id, first_name, last_name, manager_id, title, salary, name AS department_name
                        FROM employee AS t1
                        JOIN role AS t2 ON t1.role_id = t2.role_id
                        JOIN department AS t3 ON t2.department_id = t3.department_id`
                    );
                    console.table(result);
                    break;
            };
        })
        .catch((err) => {
            if(err) console.log(err);
        });
    }
};

connection.connect((err) => {
    if(err) throw err;
    queryPromise = util.promisify(connection.query).bind(connection);
    closePromise = util.promisify(connection.end).bind(connection);
});

process.on('beforeExit', function() {
    closePromise();
});