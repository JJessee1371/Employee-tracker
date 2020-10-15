const index = require('../index');
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

//Declare functions to be used to add to tables based on users initial choice
function addDept() {
    inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'What is the name of the new department?'
        }
    ])
    .then(async (data) => {
        let result = await queryPromise('INSERT INTO department SET ?', {
            name: data.department
        })
    })
    .catch((err) => {
        if(err) console.log(err);
    });
};

function addRole() {
    connection.query('SELECT * FROM department', function(err, res) {
        if(err) throw err;
        let deptsArr = [];
        for(i = 0; i < res.length; i++) {
            deptsArr.push({id: res[i].department_id, name: res[i].name});
        }
    
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the title of the role to be added?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary for this role?'
            },
            {
                name: 'newdept',
                type: 'list',
                message: 'What deparmtent will this role belong to?',
                choices: deptsArr
            } 
        ])
        .then((data) => {
            connection.query('SELECT department_id FROM department WHERE name = ?', [data.newdept], 
            (err, result) => {
                if(err) throw err;

                connection.query(
                    'INSERT INTO role SET ?',
                    {
                        title: data.title,
                        salary: data.salary,
                        department_id: result[0].department_id
                    },
                    function(err) {
                        if(err) throw err;
                    }
                );
            });
        })
        .catch((err) => {
            if(err) console.log(err);
        });
    });
};

function addEmployee() {
    connection.query('SELECT * FROM role', (err, res) => {
        if(err) throw err;
        let roleArr = [];
        for(i = 0; i < res.length; i++) {
            roleArr.push({id: res[i].role_id, name: res[i].title})
        }
        console.log(roleArr);

        inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the employees first name?'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the employees last name?'
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
        .then((data) => {
            connection.query('SELECT role_id FROM role WHERE title = ?', [data.role],
            (err, result) => {
                if(err) throw err;

                if(data.ismanager) {
                    let manager_id = null;
                } else {
                    inquirer.prompt([
                        {
                            name: 'managerfirst',
                            type: 'input',
                            message: "What is the employees' managers' first name?"
                        },
                        {
                            name: 'managerlast',
                            type: 'input',
                            message: "What is the employees' managers' last name?"
                        }
                    ])
                    .then((newdata) => {
                        connection.query('SELECT employee_id FROM employee WHERE first_name = ? AND last_name =?',
                        [newdata.managerfirst, newdata.managerlast], (err, response) => {
                            if(err) throw err;

                            manager_id = response[0].employee_id;

                            connection.query(
                                'INSERT INTO employee SET ?',
                                {
                                    first_name: data.firstName,
                                    last_name: data.lastName,
                                    role_id: result[0].role_id,
                                    manager_id: manager_id
                                },
                                function(err) {
                                    if(err) throw err;
                                }
                            );
                        })
                    })
                }
            }) 
        })
        .catch((err) => {
            if(err) console.log(err);
        })
    })
};

//ADD departments, roles, and employees
module.exports = {
    create:
    function addNew() {
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
        .then((data) => {
            let choice = data.add;
            
            //User is prompted for information based on which table is being added onto
            switch(choice) {
                case 'Add a new department':
                    addDept();
                    break;


                case 'Add a new role':
                    addRole();
                    break;


                case 'Add a new employee':
                    addEmployee();
                    break;
            };
        });
    }
};


connection.connect(async (err) => {
    if(err) throw err;
    console.log('Connected as id ' + connection.threadId);
    queryPromise = util.promisify(connection.query).bind(connection);
    closePromise = util.promisify(connection.end).bind(connection);

    let result = await queryPromise('SELECT * FROM role')
    console.table(result);
});

process.on('beforeExit', function() {
    closePromise();
});