const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();
const add = require('./JS/add');
const alter = require('./JS/update');
const view = require('./JS/view');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: process.env.DB_PASS,
    database: 'employee_tracker_db'
});


function start() {
    inquirer.prompt([
        {
            name: 'choice',
            type: 'list',
            choices: [
                'Add a department, role, or employee',
                'View departments, roles, or employees',
                "Update an employees' role",
                'EXIT'
            ],
            message: 'What action would you like to take?'
        }
    ]).then((data) => {
        switch(data.choice) {
            case 'Add a department, role, or employee':
                add.create();
                break;
            case 'View departments, roles, or employees':
                view.read();
                break;
            case "Update an employees' role":
                alter.update();
                break;
            case 'EXIT':
                process.end();
                break;
        };
    })
    .catch((err) => {
        if(err) console.log(err);
    });
}

start();

connection.connect((err) => {
    if(err) throw err;
    console.log('Connected as id ' + connection.threadId);
});