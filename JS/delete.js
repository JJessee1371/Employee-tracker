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
    //Choice of which table to remove items from
    async function deleteItems() {
        let toDelete = await inquirer.prompt([
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

        //Actions triggered based on user choice
        switch(toDelete.choice) {
            case 'Department':
                let deptRes = await inquirer.prompt([
                    {
                        name: 'deptName',
                        type: 'input',
                        message: 'Which department will be removed? Note* Associated roles will be removed.'
                    }
                ]);

                //Locate all job titles within the department and remove those titles from the employee and role tables
                let deptID = await queryPromise('SELECT department_id FROM department WHERE name = ?', [deptRes.deptName]);
                let associatedRoles = await queryPromise('SELECT role_id FROM role WHERE department_id = ?', [deptID[0].department_id]);
                for(let item of associatedRoles) {
                    await queryPromise('UPDATE employee SET role_id = null WHERE role_id = ?', [item.role_id]);
                    await queryPromise('DELETE FROM role WHERE role_id = ?', [item.role_id]);
                };

                //Once references in other tables have been deleted, remove the department from the table and return updated data to the user
                await queryPromise('DELETE FROM department WHERE ?', {name: deptRes.deptName});
                console.log('Department successfully removed! Here is your updated department list:');
                updatedDepts = await queryPromise('SELECT name AS Departments FROM department ORDER BY name');
                console.table(updatedDepts);
                break;
            
            case 'Role':
                let roleRes = await inquirer.prompt([
                    {
                        name: 'roleName',
                        type: 'input',
                        message: 'Which role will be removed?'
                    }
                ]);
                
                //Update all employee records currently in the given role to a null value
                let roleID = await queryPromise('SELECT role_id FROM role WHERE title = ?', [roleRes.roleName]);
                await queryPromise('UPDATE employee SET role_id = null WHERE role_id = ?', [roleID[0].role_id]);

                //Delete role from the table
                await queryPromise('DELETE FROM role WHERE ?', {title: roleRes.roleName});
                updatedRoles = await queryPromise('SELECT title AS Roles FROM role');
                console.log('Role successfully removed! Here is your updated list:');
                console.table(updatedRoles);
                break;

            case 'Employee':
                let employeeRes = await inquirer.prompt([
                    {
                        name: 'employeeF',
                        type: 'input',
                        message: 'What is the employees\' first name?'
                    },
                    {
                        name: 'employeeL',
                        type: 'input',
                        message: 'What is the employees\' last name?'
                    }
                ]);

                //Delete employee and display updated employee list to the user
                await queryPromise('DELETE FROM employee WHERE ? AND ?',
                [{first_name: employeeRes.employeeF}, {last_name: employeeRes.employeeL}]);
                updatedEmployees = await queryPromise('SELECT employee_id AS ID, first_name AS First, last_name AS Last FROM employee ORDER BY Last');
                console.log('Employee successfully removed! Here is your updated employe list:');
                console.table(updatedEmployees);
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