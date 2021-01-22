const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
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

module.exports = {
    remove:
    //Choose a table to remove an item from
    async function deleteItems() {
        let answer = await inquirer.prompt([
            {
                name: 'choice',
                type: 'list',
                choices: [
                    'Department',
                    'Role',
                    'Employee'
                ],
                message: 'Please choose one of the following to remove:'
            }
        ]);

        let result;
        //Actions triggered based on user choice
        switch(answer.choice) {
            case 'Department':
                let deptRes = await inquirer.prompt([
                    {
                        name: 'deptName',
                        type: 'input',
                        message: 'Which department will be removed?'
                    }
                ]);
                //Delete department and display the updated DB info to the user
                await queryPromise('DELETE FROM department WHERE ?',
                {name: deptRes.deptName});
                result = await queryPromise('SELECT * FROM department');
                console.log('Department successfully removed!');
                console.table(result);
                break;
            
            case 'Role':
                let roleRes = await inquirer.prompt([
                    {
                        name: 'roleName',
                        type: 'input',
                        message: 'Which role will be removed?'
                    }
                ]);
                //Delete role and display updated DB into to the user
                await queryPromise('DELETE FROM role WHERE ?',
                {title: roleRes.roleName});
                result = await queryPromise('SELECT * FROM role');
                console.log('Role successfully removed!');
                console.table(result);
                break;

            case 'Employee':
                let employeeRes = await inquirer.prompt([
                    {
                        name: 'employeeF',
                        type: 'input',
                        message: "What is the employees' first name?"
                    },
                    {
                        name: 'employeeL',
                        type: 'input',
                        message: "What is the employees' last name?"
                    }
                ]);
                //Delete employee and display updated DB info to the user
                await queryPromise('DELETE FROM employee WHERE ? AND ?',
                [{first_name: employeeRes.employeeF}, {last_name: employeeRes.employeeL}]);
                result = await queryPromise('SELECT * FROM employee');
                console.log('Employee successfully removed!');
                console.table(result);
                break;
        };
    }
};

connection.connect((err) => {
    if (err) console.log(err);
    queryPromise = util.promisify(connection.query).bind(connection);
    closePromise = util.promisify(connection.end).bind(connection);
});

process.on('beforeExit', function() {
    closePromise();
});