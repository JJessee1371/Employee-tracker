const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();
const add = require('./JS/add');
const alter = require('./JS/update');
const view = require('./JS/view');
const del = require('./JS/delete');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: process.env.DB_PASS,
    database: 'employee_tracker_db'
});

//Inital prompt to direct the user to the action they want to take
function start() {
    inquirer.prompt([
        {
            name: 'choice',
            type: 'list',
            choices: [
                'Add a department, role, or employee',
                'View departments, roles, or employees',
                'Remove a department, role, or employee',
                "Update an employees' role or manager",
                'EXIT'
            ],
            message: 'What action would you like to take?'
        }
    ]).then(async (data) => {
        switch(data.choice) {
            case 'Add a department, role, or employee':
                await add.create();
                start();
                break;

            case 'View departments, roles, or employees':
                await view.read();
                start();
                break;

            case 'Remove a department, role, or employee':
                await del.remove();
                start();
                break;

            case "Update an employees' role or manager":
                await alter.update();
                start();
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
});

module.exports = connection;