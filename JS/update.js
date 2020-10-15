const index = require('../index');
const inquirer = require('inquirer');
const mysql = require('mysql');
require('dotenv').config();


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: process.env.DB_PASS,
    database: 'employee_tracker_db'
});

module.exports = {
    update: 
    function updateRole() {
        connection.query('SELECT title FROM role', (err, res) => {
            if(err) throw err;
            let titleArr = []
            for(i = 0; i < res.length; i++) {
                titleArr.push(res[i].title);
            };

            inquirer.prompt([
                {
                    name: 'first',
                    type: 'input',
                    message: "What is the employees' first name?"
                },
                {
                    name: 'last',
                    type: 'input',
                    message: "What is the employees' last name?"
                },
                {
                    name: 'newrole',
                    type: 'list',
                    choices: titleArr,
                    message: "Please select the employees' new role:"
                }
            ])
            .then((data) => {
                connection.query('SELECT role_id FROM role WHERE title = ?', [data.newrole],
                (err, res) => {
                    if(err) throw err;
                    let role_id = res[0].role_id;
                    
                    connection.query('UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?',
                    [role_id, data.first, data.last], (err) => {
                        if(err) throw err;
                    });
                });
            })
            .catch((err) => {
                if(err) console.log(err);
            });
        });   
    }
};

connection.connect((err) => {
    if(err) throw err;
    console.log('Connected as id ' + connection.threadId);
});
