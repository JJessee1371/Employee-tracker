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
                    result = await queryPromise('SELECT * FROM department');
                    console.table(result);
                    break;

                case 'View all roles':
                    result = await queryPromise('SELECT * FROM role');
                    console.table(result);
                    break;

                //JOIN for full employee data including role and manager
                case 'View all employees':
                    result = await queryPromise('SELECT * FROM employee');
                    console.table(result);
                    break;
            };
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