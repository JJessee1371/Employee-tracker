const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();

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
                    'View department',
                    'View roles',
                    'View employees'
                ],
                message: 'Please select the action you would like to perform:'
            }
        ])
        .then((data) => {
            let choice = data.choice;

            switch(choice) {
                case 'View department':
                    connection.query(
                        'SELECT * FROM department',
                        function(err, res) {
                            if(err) throw err;
                            console.table(res);
                        }
                    );
                    break;

                case 'View roles':
                    connection.query(
                        'SELECT * FROM role',
                        function(err, res) {
                            if(err) throw err;
                            console.table(res);
                        }
                    );
                    break;

                case 'View employees':
                    connection.query(
                        'SELECT * FROM employee',
                        function(err, res) {
                            if(err) throw err;
                            console.table(res);
                        }
                    );
                    break;
            };
        });
    }
};

connection.connect((err) => {
    if(err) throw err;
    console.log('Connected as id ' + connection.threadId);
});

process.on('exit', function(code) {
    connection.end();
    return console.log(`About to exit with code ${code}`);
});