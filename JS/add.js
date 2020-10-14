const index = require('../index');
const inquirer = require('inquirer');
const mysql = require('mysql');

//Declare functions to be used to add to tables based on users initial choice
function addDept() {
    inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'What is the name of the new department?'
        }
    ])
    .then((data) => {
        connection.query(
            'INSERT INTO department SET ?',
            {
                name: data.department
            },
            function(err) {
                if(err) throw err;
            }
        );
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
        console.log(deptsArr);
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
                            choices: [],
                            message: "Select the employees' role from the following:"
                        },
                        {
                            name: 'manager',
                            type: 'input',
                            message: "Input the employees' manager name if they have one."
                        }
                    ])
                    .then((data) => {
                        connection.query(
                            'INSERT INTO employee SET ?',
                            {
                                first_name: data.firstName,
                                last_name: data.lastName,
                            },
                            function(err) {
                                if(err) throw err;
                            }
                        );
                    })
                    .catch((err) => {
                        if(err) console.log(err);
                    })
                    break;
            };
        });
    }
}

