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


module.exports = {
    update: 
    //User chooses whether role or manager will be updated for an employee
    async function updateItem() {
        let answer = await inquirer.prompt([
            {
                name: 'choice',
                type: 'list',
                choices: [
                    "Employees' role",
                    "Employees' manager"
                ],
                message: 'Which of the following would you like to update?'
            }
        ]);

        switch(answer.choice) {
            //Gather info to locate the employee and include their new role
            case "Employees' role":
                let result = await queryPromise('SELECT title FROM role');
                let titleArr = [];
                for(i = 0; i < result.length; i++) {
                    titleArr.push(result[i].title);
                };

                let roleAnswers = await inquirer.prompt([
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
                //Update the table with the new information
                await queryPromise('UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?',
                [response[0].role_id, roleAnswers.first, roleAnswers.last]);
                console.log('Role successfully updated!');
                //Display all data so the user can verify changes took effect
                let all = await queryPromise(
                    `SELECT employee_id, first_name, last_name, manager_id, title, salary, name AS department_name
                    FROM employee AS t1
                    JOIN role AS t2 ON t1.role_id = t2.role_id
                    JOIN department AS t3 ON t2.department_id = t3.department_id`
                );
                console.table(all);
                break;

            case "Employees' manager":
                let managerAnswer = await inquirer.prompt([
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
                        name: 'managerF',
                        type: 'input',
                        message: "What is the new managers' first name?"
                    },
                    {
                        name: 'managerL',
                        type: 'input',
                        message: "What is the managers' last name?"
                    }
                ]);
                //Query DB to find the managers' employee ID
                let managerId = await queryPromise('SELECT employee_id FROM employee WHERE first_name = ? AND last_name = ?',
                [managerAnswer.managerF, managerAnswer.managerL]);
                // Set the new manager ID with the gathered information
                await queryPromise('UPDATE employee SET manager_id = ? WHERE first_name = ? and last_name = ?',
                [managerId[0].employee_id, managerAnswer.first, managerAnswer.last]);
                console.log('Employee manager successfuly updated!');
                //Display all employee data to the user to verify changes
                let resultAll = await queryPromise(
                    `SELECT employee_id, first_name, last_name, manager_id, title, salary, name AS department_name
                    FROM employee AS t1
                    JOIN role AS t2 ON t1.role_id = t2.role_id
                    JOIN department AS t3 ON t2.department_id = t3.department_id`
                );
                console.table(resultAll);
                break;
        }
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
