const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();
const add = require('./add');
const update = require('./update');
const view = require('./view');

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






connection.connect((err) => {
    if(err) throw err;
    console.log('Connected as id ' + connection.threadId);
});