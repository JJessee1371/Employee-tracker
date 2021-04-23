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
    budget:
    async function getBudget() {
        let depts = await queryPromise('SELECT name FROM department');

        let prompt = await inquirer.prompt([
            {
                name: 'dept',
                type: 'list',
                choices: depts.map(item => {
                    return item.name;
                }),
                message: 'Which department should budget be calculated for?'
            }
        ]);

        //Get the department ID based on the user input
        let deptId = await queryPromise('SELECT department_id FROM department WHERE ?', {name: prompt.dept});

        //Locate all roles associated with the selected department
        let roles = await queryPromise('SELECT role_id, salary FROM role WHERE ?', {department_id : deptId[0].department_id});
        let rolesArr = [];
        roles.forEach(item => {
            rolesArr.push(item.role_id);
        });
        
        // Search for all employees with the selected role IDs and calculate $ spent
        let budget = 0;
        for(i = 0; i < rolesArr.length; i++) {
            let employees = await queryPromise('SELECT employee_id FROM employee WHERE ?', {role_id: rolesArr[i]});
            budget += (employees.length * roles[i].salary);
        };
        console.log(`The utilized budget for the department is $${budget}`);
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