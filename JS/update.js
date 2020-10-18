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

//Inquirer input validation functions
function noVal(input) {
    if(!input) {
        return 'This field cannot be left blank!'
    }
    return true
};

//Prompt the user for the employee information and the new role they will be assigned
module.exports = {
    update: 
    async function updateRole() {
        let result = await queryPromise('SELECT title FROM role');
            let titleArr = []
            for(i = 0; i < result.length; i++) {
                titleArr.push(result[i].title);
            };

            let answers = await inquirer.prompt([
                {
                    name: 'first',
                    type: 'input',
                    message: "What is the employees' first name?",
                    validate: noVal
                },
                {
                    name: 'last',
                    type: 'input',
                    message: "What is the employees' last name?",
                    validate: noVal
                },
                {
                    name: 'newrole',
                    type: 'list',
                    choices: titleArr,
                    message: "Please select the employees' new role:"
                }
            ]);
            
            //Get the new role_id 
            let response = await queryPromise('SELECT role_id FROM role WHERE title = ?', [answers.newrole]);
             console.log(response[0].role_id);
            //Update the table with the new information
            await queryPromise('UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?',
            [response[0].role_id, answers.first, answers.last]);
            console.log('Role successfully updated!');
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
