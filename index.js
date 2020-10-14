const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();
const add = require('./JS/add');
// const update = require('./JS/update');
// const view = require('./JS/view');

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

// function start() {
//     inquirer.prompt([
//         {
//             name: 'choice',
//             type: 'list',
//             choices: [
                
//             ]
//         }
//     ]);
// }

add.create();

connection.connect((err) => {
    if(err) throw err;
    console.log('Connected as id ' + connection.threadId);
});



// process.on('exit', function(code) {
//     connection.end();
//     return console.log(`About to exit with code ${code}`);
// });
