const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: process.env.DB_PASS,
    database: 'employee_tracker_db'
});

//MVP requirements: 
//Add departments, roles, and employees
//View deparments, roles, and employees
//Update employee roles


//ADD departments, roles, and employees
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
        
        switch(choice) {
            case 'Add a new department':
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
                });
                break;

            case 'Add a new role':
                break;

            case 'Add a new employee':
                break;
        }
    });


};

addNew();


connection.connect((err) => {
    if(err) throw err;
    console.log('Connected as id ' + connection.threadId);
});