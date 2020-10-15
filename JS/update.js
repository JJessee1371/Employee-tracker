const index = require('../index');
const inquirer = require('inquirer');
const mysql = require('mysql');
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

//Prompt the user for the employee information and the new role they will be assigned
module.exports = {
    update: 
    async function updateRole() {
        let result = await queryPromise('SELECT title FROM role');
            let titleArr = []
            for(i = 0; i < result.length; i++) {
                titleArr.push(result[i].title);
            };

            inquirer.prompt([
                {
                    name: 'first',
                    type: 'input',
                    message: "What is the employees' first name?"
                },
                {
                    name: 'last',
                    type: 'input',
                    message: "What is the employees' last name?"
                },
                {
                    name: 'newrole',
                    type: 'list',
                    choices: titleArr,
                    message: "Please select the employees' new role:"
                }
            ])
            .then(async (data) => {
                let response = await queryPromise('SELECT role_id FROM role WHERE title = ?', [data.newrole]);
                    let role_id = response[0].role_id;
                    
                    queryPromise('UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?',
                    [role_id, data.first, data.last]);
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
