const inquirer = require('inquirer');
const mysql = require('mysql');
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
        return 'This field cannot be left blank!';
    }
    return true;
};

function isNum(num) {
    if(isNaN(num)) {
        return 'This field must contain a valid number!';
    }
    return true;
};

//Function declarations to be triggered based on the users initial choice
//Add a department
async function addDept() {
    let deptDetails = await inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'What is the name of the new department?'
        }
    ]);

    await queryPromise('INSERT INTO department SET ?', {
        name: deptDetails.department
    });
    console.log('Department successfully added!');
};


//Add a role
async function addRole() {
    let departments = await queryPromise('SELECT name FROM department');

    let roleDetails = await inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'What is the title of the role to be added?',
            validate: noVal
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary for this role?',
            validate: isNum
        },
        {
            name: 'newdept',
            type: 'list',
            message: 'What deparmtent will this role belong to?',
            choices: departments
        }
    ]);

    //Get the department ID for the new role
    let response = await queryPromise('SELECT department_id FROM department WHERE name = ?',
        [roleDetails.newdept]);

    //Insert data to the table based on the users input
    await queryPromise('INSERT INTO role SET ?',
        {
            title: roleDetails.title,
            salary: roleDetails.salary,
            department_id: response[0].department_id
        },
    );
    console.log('Role successfully added!');
};


//Add an employee
async function addEmployee() {
    let roles = await queryPromise('SELECT title FROM role');
    let rolesArr = [];
    roles.forEach(item => {
        rolesArr.push(item.title);
    });

    let employeeDetails = await inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'What is the employees\' first name?',
            validate: noVal
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'What is the employees\' last name?',
            validate: noVal
        },
        {
            name: 'role',
            type: 'list',
            message: 'Select the employees\' role from the following:',
            choices: rolesArr
        },
        {
            name: 'ismanager',
            type: 'confirm',
            message: 'Is this person a manager?'
        }
    ]);
        
    //Code block is executed if the employee is not a manager
    if(!employeeDetails.ismanager) {
        let roleID = await queryPromise('SELECT role_id FROM role WHERE title = ?', [employeeDetails.role]);
        let managerInfo = await inquirer.prompt([
            {
                name: 'managerfirst',
                type: 'input',
                message: "What is the employees' managers' first name?",
                validate: noVal
            },
            {
                name: 'managerlast',
                type: 'input',
                message: "What is the employees' managers' last name?",
                validate: noVal
            }
        ])
            
        let managerID = await queryPromise('SELECT employee_id FROM employee WHERE first_name = ? AND last_name =?',
            [managerInfo.managerfirst, managerInfo.managerlast]);

        await queryPromise('INSERT INTO employee SET ?',
            {
                first_name: employeeDetails.firstName,
                last_name: employeeDetails.lastName,
                role_id: roleID[0].role_id,
                manager_id: managerID[0].employee_id
            }
        );
        console.log('Employeed successfully added!');
   
        //Code executed if the employee is a manager
        } else {
            let roleID = await queryPromise('SELECT role_id FROM role WHERE title = ?', [employeeDetails.role]);
            await queryPromise('INSERT INTO employee SET ?',
                {
                    first_name: employeeDetails.firstName,
                    last_name: employeeDetails.lastName,
                    role_id: roleID[0].role_id,
                }
            );
            console.log('Employeed successfully added!');
        }; 
};


//ADD departments, roles, and employees exported to index.js
module.exports = {
    create:
        function addNew() {
            return new Promise((resolve, reject) => {
                inquirer.prompt([
                    {
                        name: 'add',
                        type: 'list',
                        choices: [
                            'Add a new department',
                            'Add a new role',
                            'Add a new employee'
                        ],
                        message: 'Choose which item to add:'
                    }
                ])
                .then(async(data) => {
                    let choice = data.add;

                    //Users initial choice for which table will be added onto
                    switch (choice) {
                        case 'Add a new department':
                            await addDept();
                            break;

                        case 'Add a new role':
                            await addRole();
                            break;

                        case 'Add a new employee':
                            await addEmployee();
                            break; 
                    };
                    resolve(true)
                });
            });
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
