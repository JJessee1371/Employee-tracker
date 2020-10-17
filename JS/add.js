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
    if (!input) {
        return 'This field cannot be left blank!'
    }
    return true
};

function isNum() {
    if (isNaN(input)) {
        return 'This field must be a valid number!'
    }
    return true
};

//Function declarations to be triggered based on the users initial choice
//Add a department
async function addDept() {
    let answers = await inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'What is the name of the new department?'
        }
    ]);


    await queryPromise('INSERT INTO department SET ?', {
        name: answers.department
    });
};

//Add a role
async function addRole() {
    let result = await queryPromise('SELECT * FROM department');
    let deptsArr = [];
    for (i = 0; i < result.length; i++) {
        deptsArr.push({ id: result[i].department_id, name: result[i].name });
    }
    inquirer.prompt([
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
            choices: deptsArr
        }
    ])
        .then(async (data) => {
            let response = await queryPromise('SELECT department_id FROM department WHERE name = ?',
                [data.newdept]);

            await queryPromise('INSERT INTO role SET ?',
                {
                    title: data.title,
                    salary: data.salary,
                    department_id: response[0].department_id
                },
            );
        })
        .catch((err) => {
            if (err) console.log(err);
        });
};

//Add an employee
async function addEmployee() {
    let result = await queryPromise('SELECT * FROM role');
    let roleArr = [];
    for (i = 0; i < result.length; i++) {
        roleArr.push({ id: result[i].role_id, name: result[i].title })
    }

    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'What is the employees first name?',
            validate: noVal
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'What is the employees last name?',
            validate: noVal
        },
        {
            name: 'role',
            type: 'list',
            choices: roleArr,
            message: "Select the employees' role from the following:"
        },
        {
            name: 'ismanager',
            type: 'confirm',
            message: 'Is this person a manager?'
        }
    ])
        .then(async (data) => {
            //Code block is executed if the employee is not a manager
            if (!data.ismanager) {
                let result2 = await queryPromise('SELECT role_id FROM role WHERE title = ?', [data.role]);
                inquirer.prompt([
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
                    .then(async (newdata) => {
                        let result3 = await queryPromise('SELECT employee_id FROM employee WHERE first_name = ? AND last_name =?',
                            [newdata.managerfirst, newdata.managerlast]);

                        await queryPromise('INSERT INTO employee SET ?',
                            {
                                first_name: data.firstName,
                                last_name: data.lastName,
                                role_id: result2[0].role_id,
                                manager_id: result3[0].employee_id
                            }
                        );
                    });
                //Code executed if the employee is a manager
            } else {
                let result2 = await queryPromise('SELECT role_id FROM role WHERE title = ?', [data.role]);
                await queryPromise('INSERT INTO employee SET ?',
                    {
                        first_name: data.firstName,
                        last_name: data.lastName,
                        role_id: result2[0].role_id,
                    }
                );
            };
        })
        .catch((err) => {
            if (err) console.log(err);
        });
};

//ADD departments, roles, and employees
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
                        message: 'What would you like to do? Select from the following:'
                    }
                ])
                    .then(async (data) => {
                        let choice = data.add;

                        //Users initial choice for which table will be added onto
                        switch (choice) {
                            case 'Add a new department':
                                await addDept();
                                break;

                            case 'Add a new role':
                                addRole();
                                break;

                            case 'Add a new employee':
                                addEmployee();
                                break; 
                        };
                        resolve(true)
                    });
            })
        }
};


connection.connect((err) => {
    if (err) throw err;
    console.log('Connected as id ' + connection.threadId);
    queryPromise = util.promisify(connection.query).bind(connection);
    closePromise = util.promisify(connection.end).bind(connection);
});

process.on('beforeExit', function () {
    closePromise();
});