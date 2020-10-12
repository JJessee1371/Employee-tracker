const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();
const add = require('./JS/add');
const update = require('./JS/update');
const view = require('./JS/view');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: process.env.DB_PASS,
    database: 'employee_tracker_db'
});

//MVP requirements: 
//Add departments, roles, and employees
//View deparments, roles, and employees
//Update employee roles

function retrieveData() {
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
                        console.log(res);
                    }
                );
                break;

            case 'View roles':
                connection.query(
                    'SELECT * FROM role',
                    function(err, res) {
                        if(err) throw err;
                        console.log(res);
                    }
                );
                break;

            case 'View employees':
                connection.query(
                    'SELECT * FROM employee',
                    function(err, res) {
                        if(err) throw err;
                        console.log(res);
                    }
                );
                break;
        };
    });
};

retrieveData();

connection.connect((err) => {
    if(err) throw err;
    console.log('Connected as id ' + connection.threadId);
});