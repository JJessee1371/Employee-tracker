const inquirer = require('inquirer');
const mysql = require('mysql');
require('dotenv').config();
const util = require('util');
const { checkValue } = require('./validate');
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
    update: 
    //Initial choice determines what information will be updated for an employees' record
    async function updateItem() {
        let initChoice = await inquirer.prompt([
            {
                name: 'choice',
                type: 'list',
                choices: [
                    'Role',
                    'Manager',
                    'First/Last name'
                ],
                message: 'What employee information should be updated?'
            }
        ]);

        switch(initChoice.choice) {
            //Gather info to locate the employee and include their new role
            case 'Role':
                let result = await queryPromise('SELECT title FROM role');

                let roleAnswers = await inquirer.prompt([
                    {
                        name: 'first',
                        type: 'input',
                        message: 'What is the employees\' first name?',
                        validate: checkValue
                    },
                    {
                        name: 'last',
                        type: 'input',
                        message: 'What is the employees\' last name?',
                        validate: checkValue
                    },
                    {
                        name: 'newrole',
                        type: 'list',
                        choices: result.map(item => {
                            return item.title
                        }),
                        message: 'Please select the employees\' new role:'
                    }
                ]);
                
                //Retrieve the new role ID and update the record
                let roleID = await queryPromise('SELECT role_id FROM role WHERE title = ?', [roleAnswers.newrole]);
                await queryPromise('UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?',
                [roleID[0].role_id, roleAnswers.first, roleAnswers.last]);

                //Display all data so the user can verify changes took effect
                console.log('Role successfully updated! Here is the updated record:');
                let updated = await queryPromise(
                    `SELECT employee_id AS ID, first_name AS First, last_name AS Last, manager_id as Manager_ID, title AS Title, salary AS Salary, name AS Department
                    FROM employee AS t1
                    JOIN role AS t2 ON t1.role_id = t2.role_id
                    JOIN department AS t3 ON t2.department_id = t3.department_id
                    WHERE first_name = ? AND last_name = ?`,
                    [roleAnswers.first, roleAnswers.last]
                );
                console.table(updated);
                break;

            case 'Manager':
                let managerAnswer = await inquirer.prompt([
                    {
                        name: 'first',
                        type: 'input',
                        message: 'What is the employees\' first name?',
                        validate: checkValue
                    },
                    {
                        name: 'last',
                        type: 'input',
                        message: 'What is the employees\' last name?',
                        validate: checkValue
                    },
                    {
                        name: 'managerF',
                        type: 'input',
                        message: 'What is the new managers\' first name?',
                        validate: checkValue
                    },
                    {
                        name: 'managerL',
                        type: 'input',
                        message: 'What is the managers\' last name?',
                        validate: checkValue
                    }
                ]);

                //Locate the managers' employee ID then set the desired employees' manager ID with the gathered info
                let managerId = await queryPromise('SELECT employee_id FROM employee WHERE first_name = ? AND last_name = ?',
                [managerAnswer.managerF, managerAnswer.managerL]);
                await queryPromise('UPDATE employee SET manager_id = ? WHERE first_name = ? and last_name = ?',
                [managerId[0].employee_id, managerAnswer.first, managerAnswer.last]);

                //Display all employee data to the user to verify changes
                console.log('Employee manager successfuly updated! Here is the updated record:');
                let updatedInfo = await queryPromise(
                    `SELECT employee_id AS ID, first_name AS First, last_name AS Last, manager_id AS Manager_ID, title AS Title, salary AS Salary, name AS Department
                    FROM employee AS t1
                    JOIN role AS t2 ON t1.role_id = t2.role_id
                    JOIN department AS t3 ON t2.department_id = t3.department_id
                    WHERE first_name = ? AND last_name = ?`,
                    [managerAnswer.first, managerAnswer.last]
                );
                console.table(updatedInfo);
                break;

            case 'First/Last name':
                let nameAnswer = await inquirer.prompt([
                    {
                        name: 'currentFirst',
                        type: 'input',
                        message: 'What is the first name currently on record?',
                        validate: checkValue
                    },
                    {
                        name: 'currentLast',
                        type: 'input',
                        message: 'What is the last name currently on record?',
                        validate: checkValue
                    },
                    {
                        name: 'newFirst',
                        type: 'input',
                        message: 'Enter the employee\s desired first name:',
                        validate: checkValue
                    }, 
                    {
                        name: 'newLast',
                        type: 'input',
                        message: 'Enter the employee\s desired last name:',
                        validate: checkValue
                    }
                ]);

                //Locate and update the employees' name information
                await queryPromise(
                    `UPDATE employee SET first_name = ?, last_name = ?
                    WHERE first_name = ? AND last_name = ?`,
                    [nameAnswer.newFirst, nameAnswer.newLast, nameAnswer.currentFirst, nameAnswer.currentLast]
                );

                //Display all employee data to the user to verify changes
                console.log('Name successfully updated! Here is the updated record:')
                let updatedName = await queryPromise(
                    `SELECT employee_id AS ID, first_name AS First, last_name AS Last, manager_id AS Manager_ID, title AS Title, salary AS Salary, name AS Department
                    FROM employee AS t1
                    JOIN role AS t2 ON t1.role_id = t2.role_id
                    JOIN department AS t3 ON t2.department_id = t3.department_id
                    WHERE first_name = ? AND last_name = ?`,
                    [nameAnswer.newFirst, nameAnswer.newLast]
                );
                console.table(updatedName);
                break;
        };
    }
};


connection.connect((err) => {
    if(err) console.log(err);
    queryPromise = util.promisify(connection.query).bind(connection);
    closePromise = util.promisify(connection.end).bind(connection);
});

process.on('beforeExit', function() {
    closePromise();
});
