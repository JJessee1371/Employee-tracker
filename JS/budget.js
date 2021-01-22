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
        //Retrieve all department names from the DB for prompt
        let deptsArr = [];
        let depts = await queryPromise('SELECT name FROM department');
        for(i = 0; i < depts.length; i++) {
            deptsArr.push(depts[i].name);
        };

        let answer = await inquirer.prompt([
            {
                name: 'dept',
                type: 'list',
                choices: deptsArr,
                message: 'Which department should budget be calculated for?'
            }
        ]);

        //Get the department ID based on user answer
        let deptId = await queryPromise('SELECT department_id FROM department WHERE name = ?',
        [answer.dept]);

        //Locate all roles associated with the selected department
        let roles = await queryPromise('SELECT role_id, salary FROM role WHERE department_id = ?',
        [deptId[0].department_id]);
        
        let rolesArr = [];
        for(i = 0; i < roles.length; i++) {
            rolesArr.push(roles[i].role_id);
        };
        
        // Search for all employees with the selected role IDs and calculate $ spent
        let budget = 0;
        for(i = 0; i < rolesArr.length; i++) {
            let employees = await queryPromise('SELECT employee_id FROM employee WHERE role_id = ?',
            [rolesArr[i]]);
            budget += (employees.length * roles[i].salary);
        };

        console.log(`The utilized budget for the department is $${budget}`);
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