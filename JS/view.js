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

            //let result = await queryPromise('SELECT * FROM role')
    //console.table(result);

            switch(choice) {
                case 'View all departments':
                    result = await queryPromise('SELECT * FROM department');
                    console.table(result);
                    break;

                case 'View all roles':
                    result = await queryPromise('SELECT * FROM role');
                    console.table(result);
                    break;

                case 'View all employees':
                    result = await queryPromise('SELECT * FROM employee');
                    console.table(result);
                    break;
            };
        });
    }
};

//function(err, res) {
//     if(err) throw err;
//     console.table(res);
// }

connection.connect(async (err) => {
    if(err) throw err;
    console.log('Connected as id ' + connection.threadId);
    queryPromise = util.promisify(connection.query).bind(connection);
    closePromise = util.promisify(connection.end).bind(connection);
});

process.on('beforeExit', function() {
    closePromise();
});